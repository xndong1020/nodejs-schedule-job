/* eslint camelcase:0 */

const { DateTime } = require('luxon')
const { CallHistoryGetResultReport } = require('../models/CallHistoryGetResult')
const { Task } = require('../models/Task')
const { CallHoldResumeResultReport } = require('../models/CallHoldResumeResult')
const { taskType } = require('../enums')
const {
  CallUnattendedTransferResultReport
} = require('../models/CallUnattendedTransferResult')
const { logger } = require('../utils')

const saveCallHistoryGetResult = async (
  data,
  userID,
  taskId,
  type = taskType.CALL_STATUS
) => {
  try {
    const result = await CallHistoryGetResultReport.create({
      data,
      userID,
      taskId,
      type
    })
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const getCallHistoryByCallIds = callIds => {
  return new Promise((resolve, reject) => {
    CallHistoryGetResultReport.find(
      {
        'data.callId': { $in: callIds }
      },
      function (err, docs) {
        if (err) return reject(err)
        else return resolve(docs)
      }
    )
  })
}

const deleteCallHistoryByCallIds = callIds => {
  return new Promise((resolve, reject) => {
    CallHistoryGetResultReport.deleteMany(
      {
        'data.callId': { $in: callIds }
      },
      function (err, data) {
        if (err) return reject(err)
        else return resolve(data)
      }
    )
  })
}

const mergeCallHistory = callHistoryList => {
  if (!callHistoryList) return callHistoryList
  let callStatusArray = []
  let callStatusMetadata = {}
  callHistoryList.forEach(item => {
    const { data, userID, type } = item
    callStatusArray = [...callStatusArray, ...data]
    callStatusMetadata = { ...callStatusMetadata, userID, type }
  })
  return {
    ...callStatusMetadata,
    data: callStatusArray
  }
}

const organizeCallHistoryForReport = async (callIds, associatedReportId) => {
  const callHistoryList = await getCallHistoryByCallIds(callIds)
  const mergedCallHistoryDataObj = mergeCallHistory(callHistoryList)
  // clear individual call status record,
  await deleteCallHistoryByCallIds(callIds)
  // then group them together, and associated it with a report
  await CallHistoryGetResultReport.create({
    ...mergedCallHistoryDataObj,
    associatedReportId
  })
}

const saveCallHoldResumeResult = async (data, userID, taskId) => {
  try {
    const result = await CallHoldResumeResultReport.create({ data, userID, taskId })
    const callIds = data.map(item => item.callId)
    if (callIds) organizeCallHistoryForReport(callIds, result._id)
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const saveCallUnattendedTransferResult = async (data, userID, taskId) => {
  try {
    const result = await CallUnattendedTransferResultReport.create({
      data,
      userID,
      taskId
    })
    const callIds = data.map(item => item.callId)
    if (callIds) organizeCallHistoryForReport(callIds, result._id)
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const getPendingTasksFromDb = async (task_type = '') => {
  let results = []
  if (!task_type) { results = await Task.find({ status: 'pending', run_now: false }) } else { results = await Task.find({ task_type, status: 'pending', run_now: false }) }
  return results
}

const getTodayScheduledTask = async (task_type = '') => {
  const allTasks = await getPendingTasksFromDb(task_type)

  const today = DateTime.local()

  const todaysTask = allTasks.filter(task => {
    const { start_date, end_date } = task
    const state_date_obj = DateTime.fromFormat(start_date, 'MMMM d, yyyy')
    const end_date_obj = DateTime.fromFormat(end_date, 'MMMM d, yyyy')
    return end_date_obj > today && state_date_obj < today
  })

  return todaysTask
}

module.exports = {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult,
  saveCallUnattendedTransferResult,
  getPendingTasksFromDb,
  getTodayScheduledTask
}
