const { Device } = require('../models/Device')
const { setDeviceList, getDeviceList } = require('../services/redisService')

// if deviceList have been read into redis before, then read device list from redis
// otherwise read it from db
const getDeviceListFromRedis = async userID => {
  const deviceListStr = await getDeviceList()
  const deviceList = deviceListStr ? JSON.parse(deviceListStr) : undefined
  if (deviceList && Object.keys(deviceList).length > 0) return deviceList

  // read deviceList from db
  const deviceListInDb = await Device.find({ }, { modifiedBy: 0, __v: 0 })
  await setDeviceList(JSON.stringify(deviceListInDb))
  return deviceListInDb
}

module.exports = getDeviceListFromRedis
