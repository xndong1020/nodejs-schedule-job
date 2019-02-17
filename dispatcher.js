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
      try {
        await testProcessor(
          tasks,
          callStatusTester,
          saveCallHistoryGetResult,
          null,
          true
        )
      } catch (e) {
        console.error(e)
      }
      break
    case taskType.HOLD_RESUME:
      try {
        await testProcessor(
          tasks,
          callHoldAndResumeTester,
          saveCallHoldResumeResult,
          callHoldResumeReader,
          false
        )
      } catch (e) {
        console.error(e)
      }
      break

    case taskType.UNATTENDED_TRANSFER:
      try {
        await testProcessor(
          tasks,
          callUnattendedTransferTester,
          saveCallUnattendedTransferResult,
          callUnattendedTransferReader,
          false
        )
      } catch (e) {
        console.error(e)
      }
      break

    default:
      break
  }
}

module.exports = jobDispatcher
