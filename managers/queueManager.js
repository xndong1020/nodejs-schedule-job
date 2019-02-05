/* eslint camelcase:0 */

const { setTasks, getTasks } = require('../services/redisService')

const updateQueue = async (data, queueName = 'pending') => {
  await setTasks(queueName, JSON.stringify(data))
}

const readQueue = async (queueName = 'pending') => {
  const data = await getTasks(queueName)
  const result = data ? JSON.parse(data) : []
  return result
}

const dequeue = async (queueName = 'pending') => {
  const result = readQueue(queueName)
  if (result && result.length > 0) {
    const data = result.splice(0, 1)
    await updateQueue(result, queueName)
    return data
  }
}

const enqueue = async (element, queueName = 'pending') => {
  const result = readQueue(queueName)
  if (result && result.length > 0) {
    result.push(element)
    await updateQueue(result, queueName)
  }
}

const peek = async (queueName = 'pending') => {
  const result = readQueue(queueName)
  if (result && result.length > 0) return [result[0]]
  return []
}

const contains = async (predicate, queueName = 'pending') => {
  const data = await readQueue(queueName)
  return predicate(data)
}

module.exports = {
  updateQueue,
  readQueue,
  contains,
  dequeue,
  enqueue,
  peek
}
