const filter = require('app/google-calendar/filter')
const { makeReporter } = require('app/util')

module.exports = makeReporter({ filter: filter.yoga })
