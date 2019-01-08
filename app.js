/* eslint camelcase:0 */

const cron = require('node-cron')
const io = require('socket.io-client')
const { config } = require('./config')
const { callStatusTester, callHoldAndResumeTester } = require('./CallTesters')
const getUserSettingsInRedis = require('./utils/getUserSettingsInRedis')

require('dotenv').config()
require('./db')

const { callHoldResumeReader } = require('./utils/callHoldResumeReader')
const {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult,
  getTasksFromDbForNext24Hrs
} = require('./services/mongodbService')
const { setTasks, getTasks } = require('./services/redisService')
const { logger } = require('./utils/logger')

const socket = io(process.env.SOCKETIO_SERVER_URL)

socket.on('connect', () => {
  console.log('socket connected')
})
socket.on('disconnect', () => {
  console.log('socket disconnect')
})

socket.on('newTask', async () => {
  const tasks = await getTasksFromDbForNext24Hrs() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
  console.log('newTask created')
})

// task check every 5 mins
const task = cron.schedule('0 */2 * * * *', async () => {
  console.log('task is running')
  let tasks = await getTasks('tasks_pending')
  tasks = JSON.parse(tasks)

  if (tasks.length > 0) await jobDispatcher(tasks)
  else console.log('No task(s) pending')
})

const jobDispatcher = async tasks => {
  let summary_list = []
  const current_task = tasks[0]
  const { task_type, recipient, _id, userID } = current_task

  // read user settings
  if (!userID) return
  const userDeviceSettings = await getUserSettingsInRedis(userID)

  if (task_type === 'call_status') {
    try {
      for (let index = 1; index <= config.repeat_call; index++) {
        const result = await callStatusTester(recipient, userDeviceSettings)
        summary_list.push(result)
      }
      const reportId = await saveCallHistoryGetResult(summary_list.flat(1))

      if (reportId) {
        const remaining_tasks = tasks.filter(task => task._id !== _id)
        const tasks_completed_queue = await getTasks('tasks_completed')
        const tasks_completed = tasks_completed_queue
          ? JSON.parse(tasks_completed_queue)
          : []
        await setTasks(
          'tasks_completed',
          JSON.stringify([...tasks_completed, current_task])
        )

        await setTasks('tasks_pending', JSON.stringify(remaining_tasks))
        console.log('Task completed. ReportId', reportId)
        // send completed task data back to server
        socket.emit('taskComplete', { reportId })
      }
    } catch (error) {
      logger.error('Error happened when testing call status: ', error)
    }
  } else if (task_type === 'hold_resume') {
    try {
      for (let index = 1; index <= config.repeat_call; index++) {
        const response = await callHoldAndResumeTester(
          recipient,
          userDeviceSettings
        )
        const result = callHoldResumeReader(response)
        summary_list.push(result)
      }
      const reportId = await saveCallHoldResumeResult(summary_list)

      if (reportId) {
        const remaining_tasks = tasks.filter(task => task._id !== _id)
        const tasks_completed_queue = await getTasks('tasks_completed')
        const tasks_completed = tasks_completed_queue
          ? JSON.parse(tasks_completed_queue)
          : []
        await setTasks(
          'tasks_completed',
          JSON.stringify([...tasks_completed, current_task])
        )
        await setTasks('tasks_pending', JSON.stringify(remaining_tasks))
        console.log('Task completed. ReportId', reportId)
        // send completed task data back to server
        socket.emit('taskComplete', { reportId })
      }
    } catch (error) {
      logger.error('Error happened when testing call hold and resume: ', error)
    }
  }
}

task.start()
