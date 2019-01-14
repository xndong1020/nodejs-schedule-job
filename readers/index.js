const { callHistoryReader } = require('./callHistoryReader')
const { callHoldResumeReader } = require('./callHoldResumeReader')
const {
  callUnattendedTransferReader
} = require('./callUnattendedTransferReader')

module.exports = {
  callHistoryReader,
  callHoldResumeReader,
  callUnattendedTransferReader
}
