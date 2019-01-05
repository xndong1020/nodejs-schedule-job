const redis = require('redis')
const client = redis.createClient({
  port: 18511,
  host: 'redis-18511.c10.us-east-1-3.ec2.cloud.redislabs.com',
  password: '5BWKiyXk79HM23j5QEbrJAJsj0wopyKK'
})

client.on('connect', () => {
  console.log('Redis client connected')
})

const setTasks = (key, tasks) => {
  client.set(key, tasks, redis.print)
}

const getTasks = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

module.exports = {
  setTasks,
  getTasks
}
