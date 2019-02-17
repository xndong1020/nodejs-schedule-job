const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand
} = require('../commands/CommandBase')
const { callHistoryReader } = require('../readers')
const { config } = require('../config')
const { delay } = require('../utils')
const { liveTestingMessageEmitter } = require('../services/socketioService')

const callStatusTester = async (
  primaryDeviceSettings,
  secondaryDeviceSettings,
  thirdDeviceSettings = {}
) => {
  const invoker = new Invoker(
    primaryDeviceSettings,
    secondaryDeviceSettings,
    thirdDeviceSettings
  )

  console.log('before liveTestingMessageEmitter')
  liveTestingMessageEmitter(
    `Start testing call hold and resume from ${
      primaryDeviceSettings.deviceName
    }.`
  )
  console.log('after liveTestingMessageEmitter')
  await delay(3000)

  // notify admin web
  liveTestingMessageEmitter(
    `Trying to make call to ${secondaryDeviceSettings.deviceName}.`
  )

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand())
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(config.call_wait_time)

  // get call status
  const callStatus = callResponseJson.Command.DialResult[0].$.status

  if (callStatus !== 'OK') {
    // notify admin web
    liveTestingMessageEmitter(
      `Failed to make call to ${secondaryDeviceSettings.deviceName}.`
    )
    console.error(callResponseJson.Command.DialResult)
    return
  }

  // notify admin web
  liveTestingMessageEmitter(
    `Successfully made call to ${secondaryDeviceSettings.deviceName}`
  )

  // get call id
  const callId = callResponseJson.Command.DialResult[0].CallId[0]

  // notify admin web
  liveTestingMessageEmitter(
    `Trying to disconnect call to ${
      secondaryDeviceSettings.deviceName
    }. CallId is ${callId}`
  )

  // disconnect previous call
  await invoker.set_command(new DisconnectCallCommand(callId)).run_command()

  // notify admin web
  liveTestingMessageEmitter(
    `Successfully disconnected call to ${
      secondaryDeviceSettings.deviceName
    }. Now preparing data for callId ${callId}`
  )
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
