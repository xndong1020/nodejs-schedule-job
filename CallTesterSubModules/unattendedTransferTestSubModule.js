const { UnattendedTransferCommand } = require('../commands/CommandBase')
const { callUnattendedTransferResultReader } = require('../readers')
const { liveTestingMessageEmitter } = require('../services/socketioService')

// UnattendedTransfer the call to thirdDevice
const unattendedTransferTestSubModule = async (
  secondaryDeviceSettings,
  callId,
  thirdDeviceSettings,
  invoker
) => {
  // notify admin web
  liveTestingMessageEmitter(
    `${
      secondaryDeviceSettings.deviceName
    } is trying to transfer callID ${callId} to device ${
      thirdDeviceSettings.deviceName
    }.`
  )

  const unattendedTransferJson = await invoker
    .set_command(new UnattendedTransferCommand(callId))
    .run_command()
  const unattendedTransferResult = callUnattendedTransferResultReader(
    unattendedTransferJson
  )

  if (
    !unattendedTransferResult ||
    !unattendedTransferResult.status ||
    unattendedTransferResult.status !== 'OK'
  ) {
    // notify admin web
    liveTestingMessageEmitter(`Failed to transfer call for callId ${callId}.`)
    throw new Error(
      `Failed to hold call for callID ${callId}. Error Cause is '${
        unattendedTransferResult.cause
      }'. Error Description is '${unattendedTransferResult.description}'`
    )
  }

  // notify admin web
  liveTestingMessageEmitter(
    `${
      secondaryDeviceSettings.deviceName
    } successfully transferred callID ${callId} to device ${
      thirdDeviceSettings.deviceName
    }.`
  )

  return unattendedTransferJson
}

module.exports = {
  unattendedTransferTestSubModule
}
