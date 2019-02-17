const delay = require('./delay')
const getBasicAuthHeader = require('./getBasicAuthHeader')
const deviceUrlHelper = require('./deviceUrlHelper')
const getDeviceListFromRedis = require('./getDeviceListFromRedis')
const updateTaskCompletedQueue = require('./updateTaskCompletedQueue')
const xml2jsonConverter = require('./xml2json')
const { logger } = require('./logger')
const { getLocalNowWithTimezone } = require('./time.util')

module.exports = {
  delay,
  logger,
  deviceUrlHelper,
  xml2jsonConverter,
  getBasicAuthHeader,
  getDeviceListFromRedis,
  updateTaskCompletedQueue,
  getLocalNowWithTimezone
}
