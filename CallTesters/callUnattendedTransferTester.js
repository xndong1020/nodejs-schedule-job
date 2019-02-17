const { Invoker } = require('../commands/CommandBase')
const { saveCallHistoryGetResult } = require('../services/mongodbService')
const { taskType } = require('../enums')
const { delay } = require('../utils')
const {
  callStatusTestSubModule,
  unattendedTransferTestSubModule,
  disconnectCallTestSubModule,
  callHistoryGetterSubModule
} = require('../CallTesterSubModules')

const callUnattendedTransferTester = async (
  primaryDeviceSettings,
  secondaryDeviceSettings,
  thirdDeviceSettings
) => {
  const invoker = new Invoker(
    primaryDeviceSettings,
    secondaryDeviceSettings,
    thirdDeviceSettings
  )

  // delay for a few seconds to ensure previous call was finished
  await delay(5000)

  // start the initial call
  const callResult = await callStatusTestSubModule(
    secondaryDeviceSettings,
    invoker
  )
  // get call id
  const callId = callResult.callId

  // try to transfer the call
  const unattendedTransferJson = await unattendedTransferTestSubModule(
    secondaryDeviceSettings,
    callId,
    thirdDeviceSettings,
    invoker
  )

  // delay for a few seconds to ensure the transferred call has been processed before disconnection
  await delay(10000)

  // try to disconnect call
  await disconnectCallTestSubModule(secondaryDeviceSettings, callId, invoker)

  const targetCallHistoryGetResult = await callHistoryGetterSubModule(
    invoker,
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
