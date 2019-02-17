const { callStatusTestSubModule } = require('./callStatusTestSubModule')
const {
  unattendedTransferTestSubModule
} = require('./unattendedTransferTestSubModule')
const { disconnectCallTestSubModule } = require('./disconnectCallTestSubModule')
const { callHistoryGetterSubModule } = require('./callHistoryGetterSubModule')
const { callResumeTestSubModule } = require('./callResumeTestSubModule')
const { callHoldTestSubModule } = require('./callHoldTestSubModule')

module.exports = {
  callStatusTestSubModule,
  callHoldTestSubModule,
  callResumeTestSubModule,
  unattendedTransferTestSubModule,
  disconnectCallTestSubModule,
  callHistoryGetterSubModule
}
