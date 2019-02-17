/* eslint new-cap:0 */

const mongoose = require('mongoose')
const { DateTime } = require('luxon')

// Define a schema
const CallUnattendedTransferResultSchema = new mongoose.Schema({
  CallId: String,
  CallUnattendedTransferStatus: String,
  CallUnattendedTransferErrorCause: String,
  CallUnattendedTransferDescription: String
})

const CallUnattendedTransferResultReportSchema = new mongoose.Schema({
  data: Array,
  userID: String,
  taskId: String,
  type: String,
  date: {
    type: String,
    default: DateTime.local().toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
  }
})

const CallUnattendedTransferResult = new mongoose.model(
  'CallUnattendedTransferResult',
  CallUnattendedTransferResultSchema
)

const CallUnattendedTransferResultReport = new mongoose.model(
  'CallUnattendedTransferResultReport',
  CallUnattendedTransferResultReportSchema
)

module.exports = {
  CallUnattendedTransferResult,
  CallUnattendedTransferResultReport
}
