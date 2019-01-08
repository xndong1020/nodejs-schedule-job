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

const setUserSettings = (userID, settings) => {
  client.set(userID, settings, redis.print)
  client.expireat(userID, parseInt(+new Date() / 1000) + 86400)
}

const getUserSettings = userID => {
  return new Promise((resolve, reject) => {
    client.get(userID, (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

module.exports = {
  setTasks,
  getTasks,
  setUserSettings,
  getUserSettings
}
