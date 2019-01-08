const parseString = require('xml2js').parseString

const xml2jsonConverter = xml => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) return reject(err)
      return resolve(result)
    })
  })
}

module.exports = xml2jsonConverter
