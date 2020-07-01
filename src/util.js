const moment = require('moment')
const getEvents = require('app/google-calendar/getEvents')

function getDiff(a, b) {
  const aM = moment(a)
  const bM = moment(b)
  return aM.diff(bM) // in milliseconds
}

function getEventLength(event) {
  const { start, end } = event

  return getDiff(end.dateTime, start.dateTime)
}

function leftPad(num) {
  const str = String(num)
  if (str.length < 3) {
    return ' '+str
  }
  return str
}

function printEvent(event, length) {
  console.log(`- [ ${event.start.dateTime} -> ${event.end.dateTime} ] ${leftPad(length)} minutes - ${event.summary}`)
}

function printReport(events) {
  let totalMin = 0
  events.forEach((event) => {
    let lengthMin = getEventLength(event) / 1000 / 60

    totalMin += lengthMin

    printEvent(event, lengthMin)
  })

  const totalHr = totalMin / 60

  console.log(
    'TOTAL:',
    totalMin, 'minutes |',
    totalHr.toPrecision(3), 'hours',
  )
}

function printEventCsv(event, length) {
  console.log(`${event.start.dateTime},${event.end.dateTime},${length}`)
}

function printReportCsv(events) {
  console.log('start_time,end_time,duration_in_minutes')
  let totalMin = 0
  events.forEach((event) => {
    let lengthMin = getEventLength(event) / 1000 / 60

    totalMin += lengthMin

    printEventCsv(event, lengthMin)
  })

  const totalHr = totalMin / 60

  console.log(
    '\nTOTAL:',
    totalMin, 'minutes |',
    totalHr.toPrecision(3), 'hours',
  )
}

function getStartEnd(start, end, defaultValues) {
  if (!defaultValues || Object.keys(defaultValues).length < 1) {
    const monday = moment().day(1).hour(0).minute(0).second(0)
    const currentTime = moment()

    defaultValues = {
      start: monday,
      end: currentTime,
    }
  }

  let result = {}

  if (start) {
    result.start = moment(start).hour(0).minute(0).second(0)
  } else {
    result.start = defaultValues.start
  }

  if (end) {
    result.end = moment(end).hour(23).minute(59).second(59)
  } else {
    result.end = defaultValues.end
  }

  return result
}

function makeReporter(options) {
  if (!options.filter) {
    throw new Error('makeReporter Required option missing: `filter`')
  }

  options.defaultStartEndValues = options.defaultStartEndValues || {}
  options.printer = options.printer || printReport

  const reporterFunc = (_start, _end) => {
    const { start, end } = getStartEnd(_start, _end, options.defaultStartEndValues)

    getEvents({
      timeMin: start.format(),
      timeMax: end.format(),
      maxResults: 2500,
    })
     .then((events) => {
       const filteredEvents = options.filter(events)
       options.printer(filteredEvents)
     })
     .catch((err) => {
       console.log('ERR;', err)
     })
  }

  return reporterFunc
}

module.exports = {
  getEventLength,
  printEvent,
  printReport,
  printReportCsv,
  getStartEnd,
  makeReporter,
}
