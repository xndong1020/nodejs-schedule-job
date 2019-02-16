const deviceUrlHelper = (deviceProtocol, deviceIPAddress, devicePortNumber) => {
  if (!deviceProtocol || !deviceIPAddress || !devicePortNumber) return false
  return `${deviceProtocol}://${deviceIPAddress}:${devicePortNumber}/putxml`
}

module.exports = deviceUrlHelper
