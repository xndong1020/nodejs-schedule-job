const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    required: true
  },
  deviceUrl: {
    type: String,
    required: true
  },
  deviceUsername: {
    type: String,
    required: true
  },
  devicePassword: {
    type: String,
    required: true
  }
})

const Device = mongoose.model('Device', DeviceSchema)

module.exports = Device
