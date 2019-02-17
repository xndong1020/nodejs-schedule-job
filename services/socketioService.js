const io = require('socket.io-client')
require('dotenv').config()
const socket = io(process.env.SOCKETIO_SERVER_URL)

const liveTestingMessageEmitter = message => {
  console.log('liveTestingMessageEmitter', message)
  // notify admin web
  socket.emit('testProcessReport', message)
}

module.exports = {
  liveTestingMessageEmitter
}
