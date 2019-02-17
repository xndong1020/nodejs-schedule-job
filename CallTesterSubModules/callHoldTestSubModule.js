const { HoldCallCommand } = require('../commands/CommandBase')
const { callHoldResultReader } = require('../readers')
const { liveTestingMessageEmitter } = require('../services/socketioService')

const callHoldTestSubModule = async (invoker, callId) => {
  // notify admin web
  liveTestingMessageEmitter(`Trying to hold call for callID ${callId}.`)

  const holdResponseJson = await invoker
    .set_command(new HoldCallCommand(callId))
    .run_command()

  const holdResult = callHoldResultReader(holdResponseJson)
  // console.log('holdResult', holdResult)

  if (!holdResult || !holdResult.status || holdResult.status !== 'OK') {
    // notify admin web
    liveTestingMessageEmitter(`Failed to hold call for callID ${callId}.`)
    throw new Error(
      `Failed to hold call for callID ${callId}. Error Cause is '${
        holdResult.cause
      }'. Error Description is '${holdResult.description}'`
    )
  }

  // notify admin web
  liveTestingMessageEmitter(`Successfully held call for callID ${callId}.`)

  return holdResponseJson
}

module.exports = {
  callHoldTestSubModule
}
