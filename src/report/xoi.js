const filter = require('app/google-calendar/filter')
const { makeReporter, printReportCsv } = require('app/util')

module.exports = makeReporter({ filter: filter.xoi, printer: printReportCsv })
