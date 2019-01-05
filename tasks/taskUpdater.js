/* eslint camelcase:0 */

const { readFileAsync, writeFileAsync } = require('../utils/fileFSWrapper')

const updateTask = async newTask => {
  const rawData = await readFileAsync('./tasks/tasks.json')
  const taskList = JSON.parse(rawData)
  const { task_id } = newTask
  const recordIndex = taskList.findIndex(item => item.task_id === task_id)
  let newTaskList = []

  // if no record that means it is a new task
  if (recordIndex === -1) {
    newTaskList = [...taskList, newTask]
  } else {
    newTaskList = [...taskList]
    newTaskList[recordIndex] = newTask
  }
  await writeFileAsync('./tasks/tasks.json', newTaskList)
}

module.exports = {
  updateTask
}
