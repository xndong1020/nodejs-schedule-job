var cron = require("node-cron");
var io = require("socket.io-client");
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

var socket = io("http://localhost:4000");
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("disconnect");
});

socket.on("newTask", async data => {
  await updateTask(data);
  console.log("newTask created");
});

const schedule = readFile("./tasks/tasks.json").find(
  task => task.task_category === "call_status"
)["task"];
console.log(schedule);

var task = cron.schedule(schedule, async () => {
  console.log("task is running");
  let summary_list = [];
  try {
    for (let index = 1; index <= config.repeat_call; index++) {
      const result = await testCallStatus("00403362158");
      summary_list.push(result);
    }
    const reportId = await saveCallHistoryGetResult(summary_list.flat(1));
    console.log("reportId", reportId);
  } catch (error) {
    console.log(error);
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
    TODO: "Log error message";
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
