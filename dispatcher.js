/* eslint camelcase:0 */

const { callHoldResumeReader } = require('./readers')
const {
  saveCallHistoryGetResult,
  saveCallHoldResumeResult
} = require('./services/mongodbService')
const testProcessor = require('./processors')
const { callStatusTester, callHoldAndResumeTester } = require('./CallTesters')

const jobDispatcher = async tasks => {
  const current_task = tasks[0]
  const { task_type } = current_task

  switch (task_type) {
    case 'call_status':
      await testProcessor(
        tasks,
        callStatusTester,
        saveCallHistoryGetResult,
        null,
        true
      )
      break
    case 'hold_resume':
      await testProcessor(
        tasks,
        callHoldAndResumeTester,
        saveCallHoldResumeResult,
        callHoldResumeReader,
        false
      )
      break
    default:
      break
  }
}

module.exports = jobDispatcher