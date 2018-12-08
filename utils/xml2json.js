const parseString = require("xml2js").parseString;

exports.xml2jsonConverter = xml => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};
