/* eslint new-cap:0 */

const mongoose = require('mongoose')
const moment = require('moment')

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
  date: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
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
