const cron = require("node-cron");
const io = require("socket.io-client");
const { config } = require("./config");
const {
  Invoker,
  MakeCallCommand,
  DisconnectCallCommand,
  CallHistoryGetCommand
} = require("./commands/CommadBase");
const { findCallHistoryByCallId } = require("./utils/callHistoryReader");
const { saveCallHistoryGetResult } = require("./mongodbHelpers");
const { updateTask } = require("./tasks/taskUpdater");
const { readFile } = require("./utils/fileFSWrapper");
const { logger } = require("./utils/logger");

const socket = io(config.socketio_server_url);
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("disconnect");
});

socket.on("newTask", async data => {
  await updateTask(data); // receiving new tasks from server
  console.log("newTask created");
});

// read local copy of tasks list (after server starts and receives new task)
const schedule = readFile("./tasks/tasks.json").find(
  task => task.task_category === "call_status"
)["task"];

const task = cron.schedule(schedule, async () => {
  console.log("task is running");
  let summary_list = [];
  try {
    for (let index = 1; index <= config.repeat_call; index++) {
      const result = await testCallStatus("00403362158");
      summary_list.push(result);
    }
    const reportId = await saveCallHistoryGetResult(summary_list.flat(1));
    console.log("Task complate. ReportId", reportId);
    // send complate task data back to server
    socket.emit("taskComplete", { reportId });
  } catch (error) {
    logger.error("Error happened when testing call status: ", error);
  }
});

const testCallStatus = async number => {
  const invoker = new Invoker();

  // make call to recepient
  const callResponseJson = await invoker
    .set_command(new MakeCallCommand(number))
    .run_command();

  // delay for a few seconds to ensure the call quality
  await delay(config.call_wait_time);

  // get call status
  const callStatus = callResponseJson.Command.DialResult[0].$.status;
  
  if (callStatus !== "OK") {
    console.log(callResponseJson.Command.DialResult);
  }

  // get call id
  const callId = callResponseJson.Command.DialResult[0].CallId[0];

  // disconnect previous call
  await invoker.set_command(new DisconnectCallCommand(callId)).run_command();

  // get all call history
  const callHistoryGetResponse = await invoker
    .set_command(new CallHistoryGetCommand())
    .run_command();

  // find call history for previous call
  const targetCallHistoryGetResult = findCallHistoryByCallId(
    callHistoryGetResponse,
    callId
  );
  return targetCallHistoryGetResult;
};

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

task.start();
