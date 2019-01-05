//Require Mongoose
const mongoose = require("mongoose");
const moment = require("moment");

//Define a schema
const CallHistoryGetResultSchema = new mongoose.Schema({
  status: String,
  callId: String,
  Duration: String,
  DisconnectCause: String,
  DisconnectCauseCode: String,
  DisconnectCauseOrigin: String,
  DisconnectCauseType: String,
  VoiceIncomingPacketLose: String,
  VoiceIncomingPacketLosePercent: Number,
  VoiceIncomingMaxJitter: Number,
  VoiceOutgoingPacketLose: String,
  VoiceOutgoingPacketLosePercent: Number,
  VoiceOutgoingMaxJitter: Number
});

const CallHistoryGetResultReportSchema = new mongoose.Schema({
  data: Array,
  date: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm:ss a")
  }
});

const CallHistoryGetResult = new mongoose.model(
  "CallHistoryGetResult",
  CallHistoryGetResultSchema
);

const CallHistoryGetResultReport = new mongoose.model(
  "CallHistoryGetResultReport",
  CallHistoryGetResultReportSchema
);

module.exports = {
  CallHistoryGetResultReport,
  CallHistoryGetResult
};
