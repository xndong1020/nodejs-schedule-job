/* eslint camelcase:0 */

const updateTaskCompletedQueue = require('../utils/updateTaskCompletedQueue')
const { logger } = require('../utils')
const { config } = require('../config')
const { setTasks } = require('../services/redisService')
const { getDeviceListFromRedis } = require('../utils')

// for socket io
const { liveTestingMessageEmitter } = require('../services/socketioService')
require('dotenv').config()
const io = require('socket.io-client')
const socket = io(process.env.SOCKETIO_SERVER_URL)

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
    primary_device,
    secondary_device,
    third_device,
    fourth_device
  } = current_task

  // read user settings
  if (!userID) throw new Error('Unauthorized UserID')
  const devices = (await getDeviceListFromRedis(userID)) || []

  const primaryDeviceDetails = devices.find(
    device => device.deviceName === primary_device
  )
  const secondaryDeviceDetails = devices.find(
    device => device.deviceName === secondary_device
  )
  const thirdDeviceDetails = devices.find(
    device => device.deviceName === third_device
  )
  const fourthDeviceDetails = devices.find(
    device => device.deviceName === fourth_device
  )

  try {
    for (let index = 1; index <= config.repeat_call; index++) {
      const result = await testerFn(
        primaryDeviceDetails,
        secondaryDeviceDetails,
        thirdDeviceDetails,
        fourthDeviceDetails
      )
      if (readerFn) summary_list.push(readerFn(result))
      else summary_list.push(result)
    }
    const targetArray = shouldFlattenArray ? summary_list.flat(1) : summary_list
    const reportId = await reportSaverFn(targetArray, userID)
    await setTasks('task_processing', JSON.stringify([])) // clear task_processing queue
    await updateTaskCompletedQueue(current_task) // update task_complete queue

    if (reportId) {
      // send completed task data back to server
      socket.emit('taskComplete', {
        reportId,
        userID,
        taskID: _id,
        error: null
      })
      // notify admin web
      liveTestingMessageEmitter(
        `Task id ${_id} completed successfully. ReportId is ${reportId}. Also please visit <a href="/reports/${task_type}/${reportId}" target="_blank">Report Link</a> for detailed report.`
      )
    }
  } catch (error) {
    logger.error(`Error happened when testing ${task_type}: `, error)
    socket.emit('taskComplete', { reportId: null, userID, taskID: _id, error })
    // notify admin web
    liveTestingMessageEmitter(
      `Task id ${_id} failed. Error is ${error.message}`
    )
  }
}

module.exports = testProcessor
