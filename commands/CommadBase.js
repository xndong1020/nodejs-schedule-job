const axios = require("axios");
const { payloadFactory } = require("../factories/payloadFactory");
const { xml2jsonConverter } = require("../utils/xml2json");
const { getBasicAuthHeader } = require("../utils/getBasicAuthHeader");
require("dotenv").config(); 

class CommandBase {
  execute() {
    console.log("Parent execute method needs to be override in child class");
  }
}

class MakeCallCommand extends CommandBase {
  constructor(recipient_number) {
    super();
    this.recipient_number = recipient_number;
  }

  async execute() {
    const callResponse = await axios.post(
      process.env.WEBEX_API_URL,
      payloadFactory("makeCall", this.recipient_number),
      getBasicAuthHeader(process.env.WEBEX_API_USERNAME, process.env.WEBEX_API_PASSWORD)
    );
    const callResponseJson = await xml2jsonConverter(callResponse.data);
    return callResponseJson;
  }
}

class DisconnectCallCommand extends CommandBase {
  constructor(callId) {
    super();
    this.callId = callId;
  }

  async execute() {
    const callResponse = await axios.post(
      process.env.WEBEX_API_URL,
      payloadFactory("disconnectCall", this.callId),
      getBasicAuthHeader(process.env.WEBEX_API_USERNAME, process.env.WEBEX_API_PASSWORD)
    );
    const callResponseJson = await xml2jsonConverter(callResponse.data);
    return callResponseJson;
  }
}

class CallHistoryGetCommand extends CommandBase {
  async execute() {
    const callResponse = await axios.post(
      process.env.WEBEX_API_URL,
      payloadFactory("callHistoryGet", null),
      getBasicAuthHeader(process.env.WEBEX_API_USERNAME, process.env.WEBEX_API_PASSWORD)
    );
    const callResponseJson = await xml2jsonConverter(callResponse.data);
    return callResponseJson;
  }
}

class Invoker {
  constructor() {
    this.command = undefined;
  }

  set_command(command) {
    this.command = command;
    return this;
  }

  async run_command() {
    const response = await this.command.execute();
    return response;
  }
}

module.exports = {
  Invoker: Invoker,
  MakeCallCommand: MakeCallCommand,
  DisconnectCallCommand: DisconnectCallCommand,
  CallHistoryGetCommand: CallHistoryGetCommand
};
