const callHoldResumeReader = response => {
  let holdResult,
    resumeResult = undefined;

  const { holdResponseJson, resumeResponseJson } = response;
  const callHoldStatus =
    holdResponseJson["Command"]["CallHoldResult"][0]["$"]["status"];
  const callResumeStatus =
    resumeResponseJson["Command"]["CallResumeResult"][0]["$"]["status"];

  // if status is error
  if (callHoldStatus !== "OK") {
    holdResult = {
      status: callHoldStatus,
      Cause: holdResponseJson["Command"]["CallHoldResult"][0]["Cause"],
      Description:
        holdResponseJson["Command"]["CallHoldResult"][0]["Description"]
    };
  } else {
    holdResult = {
      status: callHoldStatus,
      Cause: "",
      Description: ""
    };
  }

  // if status is error
  if (callResumeStatus !== "OK") {
    resumeResult = {
      status: callResumeStatus,
      Cause: holdResponseJson["Command"]["CallResumeResult"][0]["Cause"],
      Description:
        holdResponseJson["Command"]["CallResumeResult"][0]["Description"]
    };
  } else {
    resumeResult = {
      status: callResumeStatus,
      Cause: "",
      Description: ""
    };
  }

  return {
    holdResult,
    resumeResult
  };
};

module.exports = {
  callHoldResumeReader
};
