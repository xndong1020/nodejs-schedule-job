const winston = require("winston");
require("winston-loggly-bulk");

winston.add(winston.transports.Loggly, {
  inputToken: "c76a1cbb-4ee3-436c-a13f-7e15664e7633",
  subdomain: "https://isdance.loggly.com",
  tags: ["Winston-NodeJS"],
  json: true
});

module.exports.logger = winston;
