#!/usr/bin/env node

const program = require('commander')
const airbnbReport = require('app/report/airbnb')
const landmarkReport = require('app/report/landmark')
const xoiReport = require('app/report/xoi')
const yogaReport = require('app/report/yoga')
const allReport = require('app/report/all')

let calendar, start, end

program
  .arguments('<calendar> [start] [end]')
  .action((_calendar, _start, _end) => {
    calendar = _calendar
    start = _start
    end = _end
  })

program.parse(process.argv)

if (!calendar) {
  console.error('ERROR: no calendar given; for usage, -h')
  process.exit(1)
}

const reports = {
  airbnb: airbnbReport,
  landmark: landmarkReport,
  xoi: xoiReport,
  yoga: yogaReport,
  all: allReport,
}

const VALID_CALENDARS = Object.keys(reports)
if (VALID_CALENDARS.indexOf(calendar) < 0) {
  console.error(`ERROR: invalid calendar given; valid calendars: ${VALID_CALENDARS}`)
  process.exit(1)
}

reports[calendar](start, end)
