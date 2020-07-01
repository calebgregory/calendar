const filter = require('app/google-calendar/filter')
const { makeReporter } = require('app/util')

function printReport(events) {
  console.log(events)
}

module.exports = makeReporter({ filter: filter.all, printer: printReport })
