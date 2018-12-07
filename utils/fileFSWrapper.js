const fs = require("fs");

const readFileAsync = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const readFile = filename => {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
};

const writeFileAsync = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data), (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

module.exports = {
  readFile,
  readFileAsync,
  writeFileAsync
};
