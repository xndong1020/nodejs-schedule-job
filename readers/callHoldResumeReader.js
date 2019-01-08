const callHoldResumeReader = response => {
  let holdResult

  let resumeResult
  const { callId, holdResponseJson, resumeResponseJson } = response

  if (holdResponseJson) {
    const callHoldStatus =
      holdResponseJson['Command']['CallHoldResult'][0]['$']['status']

    // if status is error
    if (callHoldStatus !== 'OK') {
      holdResult = {
        status: callHoldStatus,
        Cause: holdResponseJson['Command']['CallHoldResult'][0]['Cause'],
        Description:
          holdResponseJson['Command']['CallHoldResult'][0]['Description']
      }
    } else {
      holdResult = {
        status: callHoldStatus
      }
    }
  }
  if (resumeResponseJson) {
    const callResumeStatus =
      resumeResponseJson['Command']['CallResumeResult'][0]['$']['status']
    // if status is error
    if (callResumeStatus !== 'OK') {
      resumeResult = {
        status: callResumeStatus,
        Cause: holdResponseJson['Command']['CallResumeResult'][0]['Cause'],
        Description:
          holdResponseJson['Command']['CallResumeResult'][0]['Description']
      }
    } else {
      resumeResult = {
        status: callResumeStatus
      }
    }
  }

  if (holdResult && resumeResult) {
    return {
      callId,
      CallHoldStatus: holdResult.status,
      CallResumeStatus: resumeResult.status,
      CallHoldErrorCause: holdResult.Cause || '',
      CallHoldErrorDescription: holdResult.Description || '',
      CallResumeErrorCause: resumeResult.Cause || '',
      CallResumeErrorDescription: resumeResult.Description || ''
    }
  } else {
    return {}
  }
}

module.exports = {
  callHoldResumeReader
}
