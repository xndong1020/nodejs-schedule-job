const { DisconnectCallCommand } = require('../commands/CommandBase')
const { disconnectResultReader } = require('../readers')
const { liveTestingMessageEmitter } = require('../services/socketioService')

const disconnectCallTestSubModule = async (
  recipientDeviceSettings,
  callId,
  invoker
) => {
  // notify admin web
  liveTestingMessageEmitter(
    `Trying to disconnect call to ${
      recipientDeviceSettings.deviceName
    }. CallId is ${callId}`
  )

  // disconnect previous call
  const disconnectResponse = await invoker
    .set_command(new DisconnectCallCommand(callId))
    .run_command()

  const disconnectResult = disconnectResultReader(disconnectResponse)
  // console.log('disconnectResult', disconnectResult)

  if (
    !disconnectResult ||
    !disconnectResult.status ||
    disconnectResult.status !== 'OK'
  ) {
    // notify admin web
    liveTestingMessageEmitter(
      `Failed to disconnected call to ${recipientDeviceSettings.deviceName}.`
    )

    throw new Error(
      `Failed to disconnected call for callID ${callId}. Error Cause is '${
        disconnectResult.cause
      }'. Error Description is '${disconnectResult.description}'`
    )
  }

  // notify admin web
  liveTestingMessageEmitter(
    `Successfully disconnected call to ${
      recipientDeviceSettings.deviceName
    }. Now preparing data for callId ${callId}`
  )
}

module.exports = {
  disconnectCallTestSubModule
}
