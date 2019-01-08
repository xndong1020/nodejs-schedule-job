/* eslint new-cap:0 */

const mongoose = require('mongoose')

// Define a schema
const TaskSchema = new mongoose.Schema({
  userID: String,
  text: String,
  start_date: Date,
  end_date: Date,
  task_type: String,
  recipient: String,
  color: String,
  status: String,
  reportId: String,
  completion_date: Array
})

const Task = new mongoose.model('Task', TaskSchema)

module.exports = {
  Task
}
