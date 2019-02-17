const callStatusReader = messageObject => {
  let readResult = {}

  if (
    messageObject &&
    messageObject['Command'] &&
    messageObject['Command']['DialResult']
  ) {
    const results = messageObject['Command']['DialResult']

    if (results && results.length > 0) {
      const result = results[0]
      if (result && result['$'] && result['$']['status']) { readResult['status'] = result['$']['status'].toUpperCase() }
      if (result && result['Cause'] && result['Cause'].length > 0) { readResult['cause'] = result['Cause'][0] }
      if (result && result['Description'] && result['Description'].length > 0) { readResult['description'] = result['Description'][0] }
      if (result && result['CallId'] && result['CallId'].length > 0) { readResult['callId'] = result['CallId'][0] }
      if (result && result['ConferenceId'] && result['ConferenceId'].length > 0) { readResult['conferenceId'] = result['ConferenceId'][0] }
    }
  }

  return readResult
}

module.exports = {
  callStatusReader
}
