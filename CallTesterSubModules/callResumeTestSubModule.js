const { ResumeCallCommand } = require('../commands/CommandBase')
const { callResumeResultReader } = require('../readers')
const { liveTestingMessageEmitter } = require('../services/socketioService')

const callResumeTestSubModule = async (callId, invoker) => {
  // notify admin web
  liveTestingMessageEmitter(`Trying to resume call for callID ${callId}.`)

  const resumeResponseJson = await invoker
    .set_command(new ResumeCallCommand(callId))
    .run_command()

  const resumeResult = callResumeResultReader(resumeResponseJson)
  // console.log('resumeResult', resumeResult)

  if (!resumeResult || !resumeResult.status || resumeResult.status !== 'OK') {
    // notify admin web
    liveTestingMessageEmitter(`Failed to resume call for callID ${callId}.`)
    throw new Error(
      `Failed to  resume call for callID ${callId}. Error Cause is '${
        resumeResult.cause
      }'. Error Description is '${resumeResult.description}'`
    )
  }

  // notify admin web
  liveTestingMessageEmitter(`Successfully resume call for callID ${callId}.`)

  return resumeResponseJson
}

module.exports = {
  callResumeTestSubModule
}
