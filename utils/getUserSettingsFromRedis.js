const { Device } = require('../models/Device')
const { setUserSettings, getUserSettings } = require('../services/redisService')

const getUserSettingsFromRedis = async userID => {
  const userSettingsStr = await getUserSettings(userID)
  const userSettings = userSettingsStr ? JSON.parse(userSettingsStr) : undefined
  if (userSettings && Object.keys(userSettings).length > 0) return userSettings

  const userSettingsInDb = await Device.findOne({ userID }, { _id: 0, __v: 0 })
  await setUserSettings(userID, JSON.stringify(userSettingsInDb))
  return userSettingsInDb
}

module.exports = getUserSettingsFromRedis
