/* eslint new-cap:0 */

const mongoose = require('mongoose')

// Define a schema
const TaskSchema = new mongoose.Schema(
  {
    userID: String,
    text: String,
    run_now: Boolean,
    start_date: String,
    end_date: String,
    run_at: String,
    task_id: String,
    task_type: String,
    primary_device: String,
    secondary_device: String,
    third_device: String,
    fourth_device: String,
    status: String,
    reportId: String,
    completion_date: Array
  },
  {
    timestamps: true
  }
)

const Task = new mongoose.model('Task', TaskSchema)

module.exports = {
  Task
}
