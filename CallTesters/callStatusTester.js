const { Invoker } = require('../commands/CommandBase')
const {
  callStatusTestSubModule,
  disconnectCallTestSubModule,
  callHistoryGetterSubModule
} = require('../CallTesterSubModules')

const { delay } = require('../utils')

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

  // delay for a few seconds to ensure previous call was finished
  await delay(10000)

  // start the initial call
  const callResult = await callStatusTestSubModule(
    secondaryDeviceSettings,
    invoker
  )

  // get call id
  const callId = callResult.callId

  // try to disconnect call
  await disconnectCallTestSubModule(secondaryDeviceSettings, callId, invoker)

  const targetCallHistoryGetResult = await callHistoryGetterSubModule(
    invoker,
    callId
  )

  return targetCallHistoryGetResult
}
module.exports = callStatusTester
