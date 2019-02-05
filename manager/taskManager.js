/* eslint camelcase:0 */

const { DateTime } = require('luxon')
const { getTasks } = require('../services/redisService')

const getCurrentJobs = async () => {
  let tasks = await getTasks('tasks_pending')
  tasks = JSON.parse(tasks)

  const currentJobs = tasks.filter(task => {
    const { run_at } = task
    const bits = run_at.split(':') // split 16:30 into ['16','30']
    const now = DateTime.fromObject({ zone: 'Australia/Sydney' })

    const taskScheduledTime = DateTime.fromObject({
      year: parseInt(now.year),
      month: parseInt(now.month),
      day: parseInt(now.day),
      hour: parseInt(bits[0]),
      minute: parseInt(bits[1]),
      zone: 'Australia/Sydney'
    })

    // if scheduled time has passed
    if (now >= taskScheduledTime) {
      return task
    }
  })

  return currentJobs
}

module.exports = {
  getCurrentJobs
}
