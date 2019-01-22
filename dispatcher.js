/* eslint camelcase:0 */

const {
  callHoldResumeReader,
  callUnattendedTransferReader
} = require('./readers')
const {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult,
  saveCallUnattendedTransferResult
} = require('./services/mongodbService')
const testProcessor = require('./processors')
const {
  callStatusTester,
  callHoldAndResumeTester,
  callUnattendedTransferTester
} = require('./CallTesters')
const { taskType } = require('./enums')

const jobDispatcher = async tasks => {
  const current_task = tasks[0]
  const { task_type } = current_task

  switch (task_type) {
    case taskType.CALL_STATUS:
      await testProcessor(
        tasks,
        callStatusTester,
        saveCallHistoryGetResult,
        null,
        true
      )
      break
    case taskType.CALL_HOLD_RESUME:
      await testProcessor(
        tasks,
        callHoldAndResumeTester,
        saveCallHoldResumeResult,
        callHoldResumeReader,
        false
      )
      break

    case taskType.UNATTENDED_TRANSFER:
      await testProcessor(
        tasks,
        callUnattendedTransferTester,
        saveCallUnattendedTransferResult,
        callUnattendedTransferReader,
        false
      )
      break

    default:
      break
  }
}

module.exports = jobDispatcher
