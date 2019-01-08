/* eslint camelcase:0 */

const axios = require('axios')
const { payloadFactory } = require('../factories/payloadFactory')
const { xml2jsonConverter } = require('../utils/xml2json')
const { getBasicAuthHeader } = require('../utils/getBasicAuthHeader')
require('dotenv').config()

class CommandBase {
  execute (settings) {
    console.log('Parent execute method needs to be override in child class')
  }
}

class MakeCallCommand extends CommandBase {
  constructor (recipient_number) {
    super()
    this.recipient_number = recipient_number
  }

  async execute (settings) {
    const { deviceUrl, deviceUsername, devicePassword } = settings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('makeCall', this.recipient_number),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

class DisconnectCallCommand extends CommandBase {
  constructor (callId) {
    super()
    this.callId = callId
  }

  async execute (settings) {
    const { deviceUrl, deviceUsername, devicePassword } = settings
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

  async execute (settings) {
    const { deviceUrl, deviceUsername, devicePassword } = settings
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

  async execute (settings) {
    const { deviceUrl, deviceUsername, devicePassword } = settings
    const callResponse = await axios.post(
      deviceUrl,
      payloadFactory('resumeCall', this.callId),
      getBasicAuthHeader(deviceUsername, devicePassword)
    )
    const callResponseJson = await xml2jsonConverter(callResponse.data)
    return callResponseJson
  }
}

class CallHistoryGetCommand extends CommandBase {
  async execute (settings) {
    const { deviceUrl, deviceUsername, devicePassword } = settings
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
  constructor (settings) {
    this.settings = settings
    this.command = undefined
  }

  set_command (command) {
    this.command = command
    return this
  }

  async run_command () {
    const response = await this.command.execute(this.settings)
    return response
  }
}

module.exports = {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand,
  HoldCallCommand,
  ResumeCallCommand
}
