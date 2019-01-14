const callUnattendedTransferReader = response => {
  let UnattendedTransferResult

  const { callId, unattendedTransferJson } = response

  if (unattendedTransferJson) {
    const callUnattendedTransferStatus =
      unattendedTransferJson['Command']['CallUnattendedTransferResult'][0]['$']['status']

    // if status is error
    if (callUnattendedTransferStatus !== 'OK') {
      UnattendedTransferResult = {
        status: callUnattendedTransferStatus,
        Cause:
          unattendedTransferJson['Command']['CallUnattendedTransferResult'][0]['Cause'],
        Description:
          unattendedTransferJson['Command']['CallUnattendedTransferResult'][0]['Description']
      }
    } else {
      UnattendedTransferResult = {
        status: callUnattendedTransferStatus
      }
    }
  }

  if (UnattendedTransferResult) {
    return {
      callId,
      CallUnattendedTransferStatus: UnattendedTransferResult.status,
      CallUnattendedTransferErrorCause: UnattendedTransferResult.Cause || '',
      CallUnattendedTransferErrorDescription:
        UnattendedTransferResult.Description || ''
    }
  } else {
    return {}
  }
}

module.exports = {
  callUnattendedTransferReader
}
