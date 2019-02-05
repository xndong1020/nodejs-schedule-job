/* eslint camelcase:0 */

const { DateTime } = require('luxon')
const { updateQueue, readQueue } = require('../managers/queueManager')

const getCurrentJob = async () => {
  let tasks_pending = await readQueue('tasks_pending')

  const pendingJobsForToday = tasks_pending.filter(task => {
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

  if (pendingJobsForToday && pendingJobsForToday.length > 0) {
    const currentJob = pendingJobsForToday.splice(0, 1)
    await updateQueue(currentJob, 'task_processing')
    const pendingTaskIndex = tasks_pending.findIndex(
      task => task._id === currentJob._id
    )
    tasks_pending.splice(pendingTaskIndex, 1)
    await updateQueue(tasks_pending, 'tasks_pending')
    return currentJob
  }

  return []
}

module.exports = {
  getCurrentJob
}
