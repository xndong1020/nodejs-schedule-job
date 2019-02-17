const { MakeCallCommand } = require('../commands/CommandBase')
const { callStatusReader } = require('../readers')
const { delay } = require('../utils')
const { liveTestingMessageEmitter } = require('../services/socketioService')

const callStatusTestSubModule = async (recipientDeviceSettings, invoker) => {
  liveTestingMessageEmitter(
    `Trying to make call to ${recipientDeviceSettings.deviceName}.`
  )

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand())
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(15000)

  // get call status
  const callResult = callStatusReader(callResponseJson)

  if (
    !callResult ||
    !callResult.status ||
    !callResult.callId ||
    callResult.status !== 'OK'
  ) {
    // notify admin web
    liveTestingMessageEmitter(
      `Failed to make call to ${recipientDeviceSettings.deviceName}`
    )
    throw new Error(
      `Failed to make call to ${
        recipientDeviceSettings.deviceName
      }. Error Cause is ${callResult.cause}. Error Description is ${
        callResult.description
      }`
    )
  }

  // notify admin web
  liveTestingMessageEmitter(
    `Successfully made call to ${recipientDeviceSettings.deviceName}`
  )
  return callResult
}

module.exports = {
  callStatusTestSubModule
}
