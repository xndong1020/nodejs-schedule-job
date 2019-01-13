const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  UnattendedTransferCommand
} = require('../commands/CommandBase')
const { delay } = require('../utils')

const callUnattendedTransferTester = async (number, settings) => {
  const invoker = new Invoker(settings)

  await delay(5000)

  // make call to recipient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand(number))
    .run_command()
  console.log(callResponseJson)

  // delay for a few seconds to ensure the call quality
  await delay(15000)

  // get call status
  const callStatus = callResponseJson.Command.DialResult[0].$.status

  if (callStatus !== 'OK') {
    console.log(callResponseJson.Command.DialResult)
  }

  // get call id
  const callId = callResponseJson.Command.DialResult[0].CallId[0]

  // UnattendedTransfer the call to internal number 25142

  const unattendedTransferJson = await invoker
    .set_command(new UnattendedTransferCommand(callId))
    .run_command()

  // delay for a few seconds to ensure the call quality
  await delay(5000)

  // disconnect previous call
  await invoker.set_command(new DisconnectCallCommand(callId)).run_command()
  return {
    callId,
    unattendedTransferJson
  }
}

module.exports = callUnattendedTransferTester
