/* eslint camelcase:0 */

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
  type = taskType.CALL_STATUS
) => {
  try {
    const result = await CallHistoryGetResultReport.create({
      data,
      userID,
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

const saveCallHoldResumeResult = async (data, userID) => {
  try {
    const result = await CallHoldResumeResultReport.create({ data, userID })
    const callIds = data.map(item => item.callId)
    if (callIds) organizeCallHistoryForReport(callIds, result._id)
    return result._id
  } catch (error) {
    logger.error(error)
    throw new Error(logger)
  }
}

const saveCallUnattendedTransferResult = async (data, userID) => {
  try {
    const result = await CallUnattendedTransferResultReport.create({
      data,
      userID
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
  if (!task_type) results = await Task.find({ status: 'pending' })
  else results = await Task.find({ task_type, status: 'pending' })
  return results
}

const getTasksFromDbForNext24Hrs = async (task_type = '') => {
  const allTasks = await getPendingTasksFromDb(task_type)
  const today = new Date()

  const tasks = allTasks.filter(task => {
    const aest_start_date = new Date(task.start_date).toLocaleString('en-US', {
      timeZone: 'Australia/Sydney'
    })
    const start_date = new Date(aest_start_date)
    const aest_end_date = new Date(task.end_date).toLocaleString('en-US', {
      timeZone: 'Australia/Sydney'
    })
    const end_date = new Date(aest_end_date)
    if (start_date < today && end_date > today) {
      // const timeZoneOffset = today.getTimezoneOffset() / 60   // timezone offset between utc and aest us -11 hours

      const timeStr =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate() +
        '-' +
        task.run_at
      console.log('timeStr', timeStr)
      const aest_run_at = new Date(timeStr).toLocaleString('en-US', {
        timeZone: 'Australia/Sydney'
      })
      console.log('aest_run_at', aest_run_at)
    }
    return start_date < today && end_date > today
  })

  return tasks
}

const getScheduledTask = async (task_type = '') => {
  const allTasks = await getPendingTasksFromDb(task_type)
  const today = new Date()

  const tasks = allTasks.filter(task => {
    const aest_start_date = new Date(task.start_date).toLocaleString('en-US', {
      timeZone: 'Australia/Sydney'
    })
    const start_date = new Date(aest_start_date)
    const aest_end_date = new Date(task.end_date).toLocaleString('en-US', {
      timeZone: 'Australia/Sydney'
    })
    const end_date = new Date(aest_end_date)
    if (start_date < today && end_date > today) {
      const timeZoneOffset = today.getTimezoneOffset() / 60
      console.log('timeZoneOffset', timeZoneOffset)
      const aest_run_at = new Date(
        today.getFullYear +
          '-' +
          today.getMonth() +
          '-' +
          today.getDate() +
          task.run_at
      ).toLocaleString('en-US', {
        timeZone: 'Australia/Sydney'
      })
      console.log(aest_run_at)
    }
  })

  return tasks
}

module.exports = {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult,
  saveCallUnattendedTransferResult,
  getPendingTasksFromDb,
  getTasksFromDbForNext24Hrs,
  getScheduledTask
}
