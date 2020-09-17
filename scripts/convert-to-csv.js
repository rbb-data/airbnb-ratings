const { dsvFormat, csvFormat } = require('d3-dsv')
const startOfISOWeek = require('date-fns/startOfISOWeek')
const fs = require('fs')
const path = require('path')
const rawData = fs.readFileSync(
  path.join(__dirname, '../raw/detailed-reviews-csv-17092020 2018-2020.csv'),
  'utf8'
)

const parser = dsvFormat(',')
const csv = parser.parse(rawData)

const counts = csv.reduce((accumulator, currentValue) => {
  const date = new Date(currentValue.date)
  const cuttOf = startOfISOWeek(new Date(2019, 8))
  if (date < cuttOf) return accumulator

  const isoWeekDate = startOfISOWeek(date)

  const key = isoWeekDate.toISOString()
  if (accumulator[key] === undefined) {
    accumulator[key] = 0
  }
  accumulator[key] += 1
  return accumulator
}, {})

const sorted = Object.entries(counts)
  .map(([day, counts]) => ({ day, counts }))
  .sort((a, b) => a.day.localeCompare(b.day))

const formated = csvFormat(sorted)

fs.writeFileSync(path.join(__dirname, '../public/counts.csv'), formated, 'utf8')

console.log('done')
