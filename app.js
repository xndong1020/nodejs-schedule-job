/* eslint camelcase:0 */

const cron = require('node-cron')
const io = require('socket.io-client')
const { getTodayScheduledTask } = require('./services/mongodbService')
const { setTasks } = require('./services/redisService')
const { getCurrentJobs } = require('./manager/taskManager')
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
  const tasks = await getCurrentJobs()
  console.log('getCurrentJobs', tasks)

  if (tasks && tasks.length > 0) {
    await jobDispatcher(tasks)
  } else {
    console.log('No task(s) pending')
  }
})

task.start()
