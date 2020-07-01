const filter = require('app/google-calendar/filter')
const { printEvent, getEventLength, makeReporter } = require('app/util')

const TRAVEL_TIME = 75 // minutes

function printReport(events) {
  let totalMin = 0
  events.forEach((event) => {
    const { summary } = event
    let lengthMin = getEventLength(event) / 1000 / 60

    let min = lengthMin
    if (summary.indexOf('assisting') > 0 || summary.indexOf('classroom') > 0) {
      min += TRAVEL_TIME
    }
    totalMin += min

    printEvent(event, min)
  })

  const totalHr = totalMin / 60

  console.log(
    'TOTAL:',
    totalMin, 'minutes |',
    totalHr.toPrecision(3), 'hours',
  )
}

module.exports = makeReporter({ filter: filter.landmark, printer: printReport })
