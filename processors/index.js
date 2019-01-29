/* eslint camelcase:0 */

const updateTaskCompletedQueue = require('../utils/updateTaskCompletedQueue')
const { logger } = require('../utils')
const { config } = require('../config')
const { deviceRoles } = require('../enums')
const { setTasks } = require('../services/redisService')
const { getUserSettingsFromRedis } = require('../utils')

// for socket io
const io = require('socket.io-client')
const socket = io(process.env.SOCKETIO_SERVER_URL)
require('dotenv').config()

const testProcessor = async (
  tasks,
  testerFn,
  reportSaverFn,
  readerFn,
  shouldFlattenArray
) => {
  let summary_list = []
  const current_task = tasks[0]
  const {
    task_type,
    _id,
    userID,
    secondary_device,
    third_device
  } = current_task
  const deviceRolesValues = Object.keys(deviceRoles).map(key => {
    return deviceRoles[key]
  })

  // read user settings
  if (!userID) return
  const userDeviceSettings = await getUserSettingsFromRedis(userID)
  const { devices } = userDeviceSettings
  const primaryDeviceFromDb = devices.find(device => device.role === 'primary')
  const primaryDeviceSettings = { ...primaryDeviceFromDb, userID }
  const secondaryDeviceSettings = devices.find(
    device => device.role === 'secondary'
  )
  const thirdDeviceSettings = devices.find(device => device.role === 'third')

  const secondaryDeviceNo = deviceRolesValues.includes(secondary_device)
    ? secondaryDeviceSettings.deviceExtNo
    : secondary_device
  const thirdDeviceNo = deviceRolesValues.includes(third_device)
    ? thirdDeviceSettings.deviceExtNo
    : third_device

  try {
    for (let index = 1; index <= config.repeat_call; index++) {
      const result = await testerFn(
        primaryDeviceSettings,
        secondaryDeviceNo,
        thirdDeviceNo
      )
      if (readerFn) summary_list.push(readerFn(result))
      else summary_list.push(result)
    }
    const targetArray = shouldFlattenArray ? summary_list.flat(1) : summary_list
    const reportId = await reportSaverFn(targetArray, userID)

    if (reportId) {
      const remaining_tasks = tasks.filter(task => task._id !== _id)
      await updateTaskCompletedQueue(current_task)
      await setTasks('tasks_pending', JSON.stringify(remaining_tasks))
      // send completed task data back to server
      socket.emit('taskComplete', {
        reportId,
        userID,
        taskID: _id,
        error: null
      })
    }
  } catch (error) {
    logger.error(`Error happened when testing ${task_type}: `, error)
    socket.emit('taskComplete', { reportId: null, userID, taskID: _id, error })
  }
}

module.exports = testProcessor
