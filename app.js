/* eslint camelcase:0 */

const cron = require('node-cron')
const io = require('socket.io-client')
const { getTodayScheduledTask } = require('./services/mongodbService')
const { updateQueue, readQueue } = require('./managers/queueManager')
const { getCurrentJob } = require('./managers/taskManager')
const jobDispatcher = require('./dispatcher')

const socket = io(process.env.SOCKETIO_SERVER_URL)

require('dotenv').config()
require('./db')

socket.on('connect', () => {
  console.log('socket connected')
})
socket.on('disconnect', () => {
  console.log('socket disconnect')
})

socket.on('newTask', async () => {
  console.log('newTask created')
  await shouldProcessNextJob()
})

socket.on('taskUpdated', async () => {
  console.log('Task taskUpdated')
  await shouldProcessNextJob()
})

socket.on('taskDeleted', async () => {
  console.log('Task taskDeleted')
  await shouldProcessNextJob()
})

const shouldProcessNextJob = async () => {
  const tasks = await getTodayScheduledTask() // receiving updated tasks from server
  const taskInProcess = await readQueue('task_processing')
  // if any task is in processing, then do not continue, until current task has been processed
  if (!taskInProcess || taskInProcess.length === 0) {
    await updateQueue(tasks, 'tasks_pending') // if not task is in process, then you can update the whole
    return true
  } else {
    // otherwise do not update the whole pending_task list. you will need to exclude the task is in process from the 'pending_task list'
    const taskNotInProcess = tasks.filter(
      task => task._id.toString() !== taskInProcess[0]._id.toString()
    )
    await updateQueue(taskNotInProcess, 'tasks_pending')
    return false
  }
}

// task check every 2 mins
const task = cron.schedule('0 * * * * *', async () => {
  const next = await shouldProcessNextJob() // check and if any task is in processing
  console.log('should continue', next)
  if (next) {
    const currentJob = await getCurrentJob()

    if (currentJob && currentJob.length === 1) {
      await jobDispatcher(currentJob)
    } else {
      console.log('No task(s) pending')
    }
  } else {
    console.log('hold until current job finished processing')
  }
})

task.start()
