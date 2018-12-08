exports.findCallHistoryByCallId = (callHistoryGetResponse, callId) => {
  let targetCallHistoryGetResult = undefined;
  const callHistoryGetResultStatus =
    callHistoryGetResponse["Command"]["CallHistoryGetResult"][0]["$"]["status"];

  // if status is error
  if (callHistoryGetResultStatus !== "OK") {
    targetCallHistoryGetResult =
      callHistoryGetResponse["Command"]["CallHistoryGetResult"];
    return targetCallHistoryGetResult;
  }

  const callHistoryGetResultList =
    callHistoryGetResponse["Command"]["CallHistoryGetResult"][0]["Entry"];
  targetCallHistoryGetResult = callHistoryGetResultList
    .filter(item => item["CallId"][0] === callId && item["DaysAgo"][0] === "0")
    .map(item => {
      return {
        status: callHistoryGetResultStatus,
        CallHistoryId: item["CallHistoryId"][0],
        callId: item["CallId"][0],
        DisconnectCause: item["DisconnectCause"][0],
        DisconnectCauseCode: item["DisconnectCauseCode"][0],
        DisconnectCauseOrigin: item["DisconnectCauseOrigin"][0],
        DisconnectCauseType: item["DisconnectCauseType"][0],
        VoiceIncomingPacketLose:
          item["Audio"][0]["Incoming"][0]["PacketLoss"][0],
        VoiceIncomingPacketLosePercent: parseFloat(
          item["Audio"][0]["Incoming"][0]["PacketLossPercent"][0]
        ).toFixed(2),
        VoiceIncomingMaxJitter: parseFloat(
          item["Audio"][0]["Incoming"][0]["MaxJitter"][0]
        ).toFixed(2),
        VoiceOutgoingPacketLose:
          item["Audio"][0]["Outgoing"][0]["PacketLoss"][0],
        VoiceOutgoingPacketLosePercent: parseFloat(
          item["Audio"][0]["Outgoing"][0]["PacketLossPercent"][0]
        ).toFixed(2),
        VoiceOutgoingMaxJitter: parseFloat(
          item["Audio"][0]["Outgoing"][0]["MaxJitter"][0]
        ).toFixed(2)
      };
    });

  return targetCallHistoryGetResult;
};
