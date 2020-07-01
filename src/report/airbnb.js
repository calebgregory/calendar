const moment = require('moment')
const getEvents = require('app/google-calendar/getEvents')
const filter = require('app/google-calendar/filter')
const { getEventLength, printEvent, makeReporter, getStartEnd } = require('app/util')

const COST_PER_DAY = 53
const CHECK_IN_TIME_IN_MINUTES = 25

const getAirbnbEvents = filter.airbnb

function isEventCheckIn(event) {
  return event.summary.indexOf('check-in block') > -1
}

function getCheckInLength(event) {
  const { summary } = event

  const numGuests = summary
    .replace(/^check-in block/, '')
    .split('')
    .reduce((acc, c) => c === '-' ? acc + 1 : acc, 0)
  return numGuests * CHECK_IN_TIME_IN_MINUTES
}

function printReport(numDays, events) {
  let totalMin = 0
  events.forEach((event) => {
    let lengthMin = getEventLength(event) / 1000 / 60

    if (isEventCheckIn(event)) {
      lengthMin = getCheckInLength(event)
    }

    totalMin += lengthMin
    printEvent(event, lengthMin)
  })

  const totalHr = totalMin / 60
  const hrsPerDay = totalHr / numDays
  const hourlyRate = COST_PER_DAY / hrsPerDay

  console.log('number of days:', numDays)
  console.log(
    'TOTAL:',
    totalMin, 'minutes |',
    totalHr.toPrecision(3), 'hours |',
    hrsPerDay.toPrecision(3), 'hours/day'
  )
  console.log('HOURLY RATE:', hourlyRate.toPrecision(4))
}

function fetchEventsFromGoogleThenPrintReport(_start, _end) {
  const defaultStart = moment('2019-03-11').hour(0).minute(0).second(0)
  const currentTime = moment.utc()
  const defaultEnd = currentTime

  const { start, end } = getStartEnd(_start, _end, { start: defaultStart, end: defaultEnd })

  const numDays = end.diff(start, 'days')

  getEvents({
    timeMin: start.format(),
    timeMax: end.format(),
    maxResults: 2500,
  })
   .then((events) => {
     const airbnbEvents = getAirbnbEvents(events)
     printReport(numDays, airbnbEvents)
   })
   .catch((err) => {
     console.log('ERR;', err)
   })
}

module.exports = fetchEventsFromGoogleThenPrintReport
