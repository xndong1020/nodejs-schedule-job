const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
  port: process.env.REDIS_HOST_PORT,
  host: process.env.REDIS_HOST_URL,
  password: process.env.REDIS_HOST_PASSWORD
})

client.on('connect', () => {
  console.log('Redis client connected')
})

const setTasks = (key, tasks) => {
  client.set(key, tasks, redis.print)
  client.expireat(key, parseInt(+new Date() / 1000) + 86400)
}

const getTasks = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

const setDeviceList = devices => {
  client.set('deviceList', devices, redis.print)
  client.expireat('deviceList', parseInt(+new Date() / 1000) + 86400)
}

const getDeviceList = () => {
  return new Promise((resolve, reject) => {
    client.get('deviceList', (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

const clearDeviceList = () => {
  return new Promise((resolve, reject) => {
    client.del('deviceList', (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

module.exports = {
  setTasks,
  getTasks,
  setDeviceList,
  getDeviceList,
  clearDeviceList
}
