const js2xmlparser = require('js2xmlparser')

const payloadFactory = (type, payload) => {
  let result = {}
  switch (type) {
    case 'makeCall':
      const makecallRequestJson = { Dial: { Number: payload } }
      result = js2xmlparser.parse('Command', makecallRequestJson)
      break
    case 'disconnectCall':
      const disconnectCallRequestJson = {
        Call: { Disconnect: { CallId: payload } }
      }
      result = js2xmlparser.parse('Command', disconnectCallRequestJson)
      break
    case 'holdCall':
      const holdCallRequestJson = {
        Call: { Hold: { CallId: payload, Reason: 'Other' } }
      }
      result = js2xmlparser.parse('Command', holdCallRequestJson)
      break
    case 'resumeCall':
      const resumeCallRequestJson = {
        Call: { Resume: { CallId: payload } }
      }
      result = js2xmlparser.parse('Command', resumeCallRequestJson)
      break
    case 'unattendedTransferCall':
      const unattendedTransferCallRequestJson = {
        Call: {
          UnattendedTransfer: {
            CallId: payload.callId,
            Number: payload.thirdDeviceNo
          }
        }
      }
      result = js2xmlparser.parse('Command', unattendedTransferCallRequestJson)
      break

    case 'callHistoryGet':
      const callHistoryGetRequestJson = {
        CallHistory: { Get: { DetailLevel: 'Full' } }
      }
      result = js2xmlparser.parse('Command', callHistoryGetRequestJson)
      break
    default:
      break
  }

  return result
}

module.exports = {
  payloadFactory
}
