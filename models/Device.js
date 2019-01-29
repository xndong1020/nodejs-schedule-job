const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  devices: Array
})

const Device = mongoose.model('Device', DeviceSchema)

module.exports = {
  Device
}
