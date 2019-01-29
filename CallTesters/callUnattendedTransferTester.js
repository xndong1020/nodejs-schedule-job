const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand,
  UnattendedTransferCommand
} = require('../commands/CommandBase')
const { callHistoryReader } = require('../readers')
const { saveCallHistoryGetResult } = require('../services/mongodbService')
const { taskType } = require('../enums')
const { delay } = require('../utils')

const callUnattendedTransferTester = async (
  primaryDeviceSettings,
  secondaryDeviceNo,
  thirdDeviceNo = ''
) => {
  const invoker = new Invoker(
    primaryDeviceSettings,
    secondaryDeviceNo,
    thirdDeviceNo
  )

  await delay(5000)

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand())
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

  // UnattendedTransfer the call to thirdDeviceNo

  const unattendedTransferJson = await invoker
    .set_command(new UnattendedTransferCommand(callId))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(5000)

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

  // backup call history
  await saveCallHistoryGetResult(
    targetCallHistoryGetResult,
    primaryDeviceSettings.userID,
    taskType.UNATTENDED_TRANSFER
  )

  return {
    callId,
    unattendedTransferJson
  }
}

module.exports = callUnattendedTransferTester
