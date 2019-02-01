/* eslint camelcase:0 */

const axios = require('axios')
const { payloadFactory } = require('../factories/payloadFactory')
const { xml2jsonConverter } = require('../utils')
const { getBasicAuthHeader } = require('../utils')
const { logger } = require('../utils')
require('dotenv').config()

class CommandBase {
  execute (settings) {
    console.log('Parent execute method needs to be override in child class')
  }
}

class MakeCallCommand extends CommandBase {
  async execute (primaryDeviceSettings, secondaryDeviceDetails) {
    try {
      const {
        deviceUrl,
        deviceUsername,
        devicePassword
      } = primaryDeviceSettings
      // if secondary is controlled, use its deviceExtNo, otherwise use its deviceNumber or deviceAddr
      const secondaryDeviceNo =
        secondaryDeviceDetails.isDeviceApiControlled === 'controlled'
          ? secondaryDeviceDetails.deviceExtNo
          : secondaryDeviceDetails.deviceNumberAddr
      const callResponse = await axios.post(
        deviceUrl,
        payloadFactory('makeCall', secondaryDeviceNo),
        getBasicAuthHeader(deviceUsername, devicePassword)
      )
      const callResponseJson = await xml2jsonConverter(callResponse.data)
      return callResponseJson
    } catch (err) {
      logger.error('MakeCallCommand', err)
      console.log(err)
    }
  }
}

class DisconnectCallCommand extends CommandBase {
  constructor (callId) {
    super()
    this.callId = callId
  }

  async execute (primaryDeviceSettings) {
    const { deviceUrl, deviceUsername, devicePassword } = primaryDeviceSettings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('disconnectCall', this.callId),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

class HoldCallCommand extends CommandBase {
  constructor (callId) {
    super()
    this.callId = callId
  }

  async execute (primaryDeviceSettings) {
    const { deviceUrl, deviceUsername, devicePassword } = primaryDeviceSettings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('holdCall', this.callId),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

class ResumeCallCommand extends CommandBase {
  constructor (callId) {
    super()
    this.callId = callId
  }

  async execute (primaryDeviceSettings) {
    const { deviceUrl, deviceUsername, devicePassword } = primaryDeviceSettings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('resumeCall', this.callId),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

// My code UnattendedTransfer Command
class UnattendedTransferCommand extends CommandBase {
  constructor (callId) {
    super()
    this.callId = callId
  }

  async execute (
    primaryDeviceSettings,
    secondaryDeviceDetails,
    thirdDeviceDetails
  ) {
    try {
      const {
        deviceUrl,
        deviceUsername,
        devicePassword
      } = primaryDeviceSettings
      const thirdDeviceNo =
        thirdDeviceDetails.isDeviceApiControlled === 'controlled'
          ? thirdDeviceDetails.deviceExtNo
          : thirdDeviceDetails.deviceNumberAddr
      const callResponse = await axios.post(
        deviceUrl,
        payloadFactory('unattendedTransferCall', {
          callId: this.callId,
          thirdDeviceNo
        }),
        getBasicAuthHeader(deviceUsername, devicePassword)
      )
      const callResponseJson = await xml2jsonConverter(callResponse.data)
      return callResponseJson
    } catch (err) {
      logger.error('UnattendedTransferCommand', err)
      console.log(err)
    }
  }
}

class CallHistoryGetCommand extends CommandBase {
  async execute (primaryDeviceSettings) {
    const { deviceUrl, deviceUsername, devicePassword } = primaryDeviceSettings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('callHistoryGet', null),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

class Invoker {
  constructor (
    primaryDeviceDetails,
    secondaryDeviceDetails,
    thirdDeviceDetails,
    fourthDeviceDetails
  ) {
    this.primaryDeviceDetails = primaryDeviceDetails
    this.secondaryDeviceDetails = secondaryDeviceDetails
    this.thirdDeviceDetails = thirdDeviceDetails
    this.fourthDeviceDetails = fourthDeviceDetails
    this.command = undefined
  }

  set_command (command) {
    this.command = command
    return this
  }

  async run_command () {
    const response = await this.command.execute(
      this.primaryDeviceDetails,
      this.secondaryDeviceDetails,
      this.thirdDeviceDetails,
      this.fourthDeviceDetails
    )
    return response
  }
}

module.exports = {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand,
  HoldCallCommand,
  ResumeCallCommand,
  UnattendedTransferCommand
}
