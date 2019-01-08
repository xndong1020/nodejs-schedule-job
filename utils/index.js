const delay = require('./delay')
const getBasicAuthHeader = require('./getBasicAuthHeader')
const getUserSettingsFromRedis = require('./getUserSettingsFromRedis')
const updateTaskCompletedQueue = require('./updateTaskCompletedQueue')
const xml2jsonConverter = require('./xml2json')
const { logger } = require('./logger')

module.exports = {
  delay,
  logger,
  xml2jsonConverter,
  getBasicAuthHeader,
  getUserSettingsFromRedis,
  updateTaskCompletedQueue
}
