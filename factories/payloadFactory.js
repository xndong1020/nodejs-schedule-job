const js2xmlparser = require("js2xmlparser");

const payloadFactory = (type, payload) => {
  let result = {};
  switch (type) {
    case "makeCall":
      const makecallRequestJson = { Dial: { Number: payload } };
      result = js2xmlparser.parse("Command", makecallRequestJson);
      break;
    case "disconnectCall":
      const disconnectCallRequestJson = {
        Call: { Disconnect: { CallId: payload } }
      };
      result = js2xmlparser.parse("Command", disconnectCallRequestJson);
      break;
    case "callHistoryGet":
      const callHistoryGetRequestJson = {
        CallHistory: { Get: { DetailLevel: "Full" } }
      };
      result = js2xmlparser.parse("Command", callHistoryGetRequestJson);
      break;
    default:
      break;
  }

  return result;
};

module.exports = {
  payloadFactory
};
