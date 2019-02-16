const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true
  },
  deviceType: {
    type: String
  },
  isDeviceApiControlled: {
    type: String,
    required: true,
    enum: ['controlled', 'uncontrolled']
  },
  deviceProtocol: {
    type: String
  },
  deviceIPAddress: {
    type: String
  },
  devicePortNumber: {
    type: String
  },
  deviceExtNo: {
    type: String
  },
  deviceUsername: {
    type: String
  },
  devicePassword: {
    type: String
  },
  deviceNumberAddr: {
    type: String
  },
  modifiedBy: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  }
})

const Device = mongoose.model('Device', DeviceSchema)

module.exports = {
  Device
}
