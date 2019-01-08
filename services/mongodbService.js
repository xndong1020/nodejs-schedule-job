/* eslint camelcase:0 */

const { CallHistoryGetResultReport } = require('../models/CallHistoryGetResult')
const { Task } = require('../models/Task')
const { CallHoldResumeResultReport } = require('../models/CallHoldResumeResult')
const { logger } = require('../utils')

const saveCallHistoryGetResult = async data => {
  try {
    const result = await CallHistoryGetResultReport.create({ data })
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const saveCallHoldResumeResult = async data => {
  try {
    const result = await CallHoldResumeResultReport.create({ data })
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const getTasksFromDb = async (task_type = '') => {
  let results = []
  if (!task_type) results = await Task.find({})
  else results = await Task.find({ task_type })
  return results
}

const getTasksFromDbForNext24Hrs = async (task_type = '') => {
  const allTasks = await getTasksFromDb(task_type)
  const today = Date.now()
  const tasks = allTasks.filter(
    task =>
      task.start_date <= today &&
      task.end_date >= today &&
      task.status === 'pending'
  )
  return tasks
}

module.exports = {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult,
  getTasksFromDb,
  getTasksFromDbForNext24Hrs
}
