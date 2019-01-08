const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  HoldCallCommand,
  ResumeCallCommand
} = require('../commands/CommandBase')
const { delay } = require('../utils')

const callHoldAndResumeTester = async (number, settings) => {
  const invoker = new Invoker(settings)

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

module.exports = callHoldAndResumeTester