//Import the mongoose module
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const { config } = require("../config");

//Set up default mongoose connection
mongoose.connect(
  config.mongodb_url,
  { useNewUrlParser: true }
);
// Get Mongoose to use the bluebird promise library
mongoose.Promise = bluebird;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", console.log.bind(console, "MongoDB connected."));

