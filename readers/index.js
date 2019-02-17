const { callHistoryReader } = require('./callHistoryReader')
const { callHoldResumeReader } = require('./callHoldResumeReader')
const {
  callUnattendedTransferReader
} = require('./callUnattendedTransferReader')
const { callHoldResultReader } = require('./callHoldResultReader')
const { callResumeResultReader } = require('./callResumeResultReader')
const { callStatusReader } = require('./callStatusReader')
const { disconnectResultReader } = require('./disconnectResultReader')
const { callUnattendedTransferResultReader } = require('./callUnattendedTransferResultReader')

module.exports = {
  callHistoryReader,
  callHoldResultReader,
  callResumeResultReader,
  callStatusReader,
  disconnectResultReader,
  callUnattendedTransferResultReader,
  callHoldResumeReader,
  callUnattendedTransferReader
}
