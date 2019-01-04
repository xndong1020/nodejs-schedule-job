const {
  CallHistoryGetResultReport
} = require("../models/CallHistoryGetResult");
const { logger } = require("../utils/logger");

const saveCallHistoryGetResult = async data => {
  try {
    const result = await CallHistoryGetResultReport.create({ data });
    return result._id;
  } catch (error) {
    logger.error(error);
    throw new Error(logger);
  }
};

module.exports = {
  saveCallHistoryGetResult
};
