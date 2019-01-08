/* eslint camelcase:0 */

const { setTasks, getTasks } = require('../services/redisService')

const updateTaskCompletedQueue = async current_task => {
  const tasks_completed_queue = await getTasks('tasks_completed')
  const tasks_completed = tasks_completed_queue
    ? JSON.parse(tasks_completed_queue)
    : []
  await setTasks(
    'tasks_completed',
    JSON.stringify([...tasks_completed, current_task])
  )
}

module.exports = updateTaskCompletedQueue
