const { Invoker } = require('../commands/CommandBase')
const { saveCallHistoryGetResult } = require('../services/mongodbService')
const { taskType } = require('../enums')
const { delay } = require('../utils')
const {
  callStatusTestSubModule,
  callHoldTestSubModule,
  callResumeTestSubModule,
  disconnectCallTestSubModule,
  callHistoryGetterSubModule
} = require('../CallTesterSubModules')

const callHoldAndResumeTester = async (
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
  await delay(5000)

  // start the initial call
  const callResult = await callStatusTestSubModule(
    secondaryDeviceSettings,
    invoker
  )
  // get call id
  const callId = callResult.callId
  // console.log('callId', callId)

  // start testing call hold
  const holdResponseJson = await callHoldTestSubModule(invoker, callId)

  // delay for a few seconds to ensure the call quality
  await delay(5000)

  // start testing call resume
  const resumeResponseJson = await callResumeTestSubModule(callId, invoker)

  // delay for a few seconds to ensure the call quality
  await delay(5000)

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
    taskType.CALL_HOLD_RESUME
  )

  return {
    callId,
    holdResponseJson,
    resumeResponseJson
  }
}

module.exports = callHoldAndResumeTester
