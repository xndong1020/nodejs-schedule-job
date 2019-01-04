const mongoose = require("mongoose");

//Define a schema
const TaskSchema = new mongoose.Schema({
    text: String,
    start_date: Date,
    end_date: Date,
    task_type: String,
    recipient: String,
    color: String
  });


  const Task = new mongoose.model(
    "Task",
    TaskSchema
  );

  module.exports = {
    Task
  };
  