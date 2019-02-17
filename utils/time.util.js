const { DateTime } = require('luxon')

const getLocalNowWithTimezone = (timezone = 'Australia/Sydney') => {
  const now = DateTime.fromObject({ zone: timezone })
  const nowWithTimezone = DateTime.fromObject({
    year: parseInt(now.year),
    month: parseInt(now.month),
    day: parseInt(now.day),
    hour: parseInt(now.hour),
    minute: parseInt(now.minute),
    second: parseInt(now.second),
    zone: timezone
  })

  return nowWithTimezone.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
}

module.exports = {
  getLocalNowWithTimezone
}
