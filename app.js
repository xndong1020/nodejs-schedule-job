/* eslint camelcase:0 */

const cron = require('node-cron')
const io = require('socket.io-client')
const { getTodayScheduledTask } = require('./services/mongodbService')
const { setTasks, getTasks } = require('./services/redisService')
// const { getCurrentJobs } = require('./manager/taskManager')
const jobDispatcher = require('./dispatcher')
const { DateTime } = require('luxon')

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
  const tasks = await getTodayScheduledTask() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

socket.on('taskUpdated', async () => {
  console.log('Task taskUpdated')
  const tasks = await getTodayScheduledTask() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

socket.on('taskDeleted', async () => {
  console.log('Task taskDeleted')
  const tasks = await getTodayScheduledTask() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

// task check every 2 mins
const task = cron.schedule('0 * * * * *', async () => {
  // const tasks = await getCurrentJobs()
  // console.log('getCurrentJobs', tasks)

  let tasks = await getTasks('tasks_pending')
  tasks = JSON.parse(tasks)

  const currentJobs = tasks.filter(task => {
    const { run_at } = task
    const bits = run_at.split(':') // split 16:30 into ['16','30']
    const now = DateTime.fromObject({ zone: 'Australia/Sydney' })

    const zoneName = now.zoneName
    console.log('zoneName', zoneName)
    console.log('now', now)

    const taskScheduledTime = DateTime.local(
      parseInt(DateTime.local().year),
      parseInt(DateTime.local().month),
      parseInt(DateTime.local().day),
      parseInt(bits[0]),
      parseInt(bits[1])
    ).setZone('Australia/Sydney')

    console.log('taskScheduledTime', taskScheduledTime)
    console.log(now.diff(taskScheduledTime, 'minutes').toObject())
    // if scheduled time has passed
    if (now >= taskScheduledTime) {
      return task
    }
  })

  console.log('currentJobs', currentJobs)

  if (currentJobs && currentJobs.length > 0) {
    // await jobDispatcher(tasks)
    console.log(jobDispatcher)
    console.log('has job')
  } else {
    console.log('No task(s) pending')
  }
})

task.start()
