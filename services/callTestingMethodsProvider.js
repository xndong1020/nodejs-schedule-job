const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand,
  HoldCallCommand,
  ResumeCallCommand
} = require('../commands/CommandBase')
const { callHistoryReader } = require('../utils/callHistoryReader')
const { config } = require('../config')

const callStatusTester = async number => {
  const invoker = new Invoker()

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

const callHoldAndResumeTester = async number => {
  const invoker = new Invoker()

  await delay(5000)

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand(number))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(15000)

  // get call status
  const callStatus = callResponseJson.Command.DialResult[0].$.status

  if (callStatus !== 'OK') {
    console.log(callResponseJson.Command.DialResult)
  }

  // get call id
  const callId = callResponseJson.Command.DialResult[0].CallId[0]

  const holdResponseJson = await invoker
    .set_command(new HoldCallCommand(callId))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(5000)

  const resumeResponseJson = await invoker
    .set_command(new ResumeCallCommand(callId))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(5000)

  // disconnect previous call
  await invoker.set_command(new DisconnectCallCommand(callId)).run_command()
  return {
    callId,
    holdResponseJson,
    resumeResponseJson
  }
}

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  callStatusTester,
  callHoldAndResumeTester,
  delay
}
