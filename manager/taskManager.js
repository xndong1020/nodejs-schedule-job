/* eslint camelcase:0 */

const { DateTime } = require('luxon')
const { getTasks } = require('../services/redisService')

const getCurrentJobs = async () => {
  let tasks = await getTasks('tasks_pending')
  tasks = JSON.parse(tasks)

  const currentJobs = tasks.filter(task => {
    const { run_at } = task
    const bits = run_at.split(':') // split 16:30 into ['16','30']
    const now = DateTime.local()

    const taskScheduledTime = DateTime.local(
      parseInt(now.year),
      parseInt(now.month),
      parseInt(now.day),
      parseInt(bits[0]),
      parseInt(bits[1])
    )
    // if scheduled time has passed
    if (now >= taskScheduledTime) {
      console.log('check time', taskScheduledTime.toISO(), now.toISO())
      console.log(now.diff(taskScheduledTime, 'minutes').toObject())
      return task
    }
  })

  return currentJobs
}

module.exports = {
  getCurrentJobs
}
