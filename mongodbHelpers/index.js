const {
  CallHistoryGetResultReport
} = require("../models/CallHistoryGetResult");

const saveCallHistoryGetResult = async data => {
  const result = await CallHistoryGetResultReport.create({ data });
  return result._id;
};

module.exports = {
  saveCallHistoryGetResult
};
