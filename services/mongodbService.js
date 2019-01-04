const {
  CallHistoryGetResultReport
} = require("../models/CallHistoryGetResult");
const { Task } = require("../models/Task");
const { logger } = require("../utils/logger");

const saveCallHistoryGetResult = async data => {
  try {
    const result = await CallHistoryGetResultReport.create({ data });
    return result._id;
  } catch (error) {
    logger.error(error);
    throw new Error(logger);
  }
};

const getTasksFromDb = async (task_type = "") => {
  let results = [];
  if (!task_type) results = await Task.find({});
  else results = await Task.find({ task_type });
  return results;
};

const getTasksFromDbForNext24Hrs = async (task_type = "") => {
  const allTasks = await getTasksFromDb(task_type);
  const today = Date.now();
  const tasks = allTasks.filter(
    task => task.start_date <= today && task.end_date >= today
  );
  return tasks;
};

module.exports = {
  saveCallHistoryGetResult,
  getTasksFromDb,
  getTasksFromDbForNext24Hrs
};
