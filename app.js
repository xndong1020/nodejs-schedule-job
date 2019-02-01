/* eslint camelcase:0 */

const cron = require('node-cron')
const io = require('socket.io-client')
const { getTasksFromDbForNext24Hrs } = require('./services/mongodbService')
const { setTasks, getTasks } = require('./services/redisService')
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
  const tasks = await getTasksFromDbForNext24Hrs() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

socket.on('taskUpdated', async () => {
  console.log('Task taskUpdated')
  const tasks = await getTasksFromDbForNext24Hrs() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

socket.on('taskDeleted', async () => {
  console.log('Task taskDeleted')
  const tasks = await getTasksFromDbForNext24Hrs() // receiving new tasks from server
  console.log(tasks)
  await setTasks('tasks_pending', JSON.stringify(tasks))
})

// task check every 5 mins
const task = cron.schedule('0 */2 * * * *', async () => {
  console.log('task is running')
  let tasks = await getTasks('tasks_pending')
  tasks = JSON.parse(tasks)

  if (tasks && tasks.length > 0) await jobDispatcher(tasks)
  else console.log('No task(s) pending')
})

task.start()
