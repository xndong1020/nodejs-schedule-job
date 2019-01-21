const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand
} = require('../commands/CommandBase')
const { callHistoryReader } = require('../readers')
const { config } = require('../config')
const { delay } = require('../utils')

const callStatusTester = async (number, settings) => {
  const invoker = new Invoker(settings)

  await delay(3000)

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand(number))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(config.call_wait_time)

  // get call status
  const callStatus = callResponseJson.Command.DialResult[0].$.status

  if (callStatus !== 'OK') {
    console.log(callResponseJson.Command.DialResult)
  }

  // get call id
  const callId = callResponseJson.Command.DialResult[0].CallId[0]

  // disconnect previous call
  await invoker.set_command(new DisconnectCallCommand(callId)).run_command()

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
module.exports = callStatusTester
