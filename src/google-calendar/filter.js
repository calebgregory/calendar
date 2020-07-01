function makeFilter(colorId) {
  return (events) => {
    const filtered = events.filter((e) => e.colorId === colorId)
    return filtered
  }
}

const mapDomainToColorID = {
  airbnb: '11',
  xoi: '3',
  landmark: '6',
  yoga: '5',
}

const mapDomainToFilterFunc = Object.keys(mapDomainToColorID).reduce((acc, domain) => {
  const colorID = mapDomainToColorID[domain]
  acc[domain] = makeFilter(colorID)
  return acc
}, {})

// add 'all' which filters out no events
mapDomainToFilterFunc.all = (events) => events

module.exports = mapDomainToFilterFunc
