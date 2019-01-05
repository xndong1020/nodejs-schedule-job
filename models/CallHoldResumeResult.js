/* eslint new-cap:0 */

const mongoose = require('mongoose')
const moment = require('moment')

// Define a schema
const CallHoldResumeResultSchema = new mongoose.Schema({
  CallId: String,
  CallHoldStatus: String,
  CallResumeStatus: String,
  CallHoldErrorCause: String,
  CallHoldErrorDescription: String,
  CallResumeErrorCause: String,
  CallResumeErrorDescription: String
})

const CallHoldResumeResultReportSchema = new mongoose.Schema({
  data: Array,
  date: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  }
})

const CallHoldResumeResult = new mongoose.model(
  'CallHoldResumeResult',
  CallHoldResumeResultSchema
)

const CallHoldResumeResultReport = new mongoose.model(
  'CallHoldResumeResultReport',
  CallHoldResumeResultReportSchema
)

module.exports = {
  CallHoldResumeResult,
  CallHoldResumeResultReport
}
