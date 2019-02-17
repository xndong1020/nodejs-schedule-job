const { callHistoryReader } = require('../readers')
const { CallHistoryGetCommand } = require('../commands/CommandBase')

const callHistoryGetterSubModule = async (invoker, callId) => {
  // get all call history
  const callHistoryGetResponse = await invoker
    .set_command(new CallHistoryGetCommand())
    .run_command()

  // find call history for previous call
  const targetCallHistoryGetResult = callHistoryReader(
    callHistoryGetResponse,
    callId
  )

  return targetCallHistoryGetResult
}

module.exports = {
  callHistoryGetterSubModule
}
