const { dsvFormat, csvFormat } = require('d3-dsv')
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
  const year = date.getFullYear()
  const month = date
    .getMonth()
    .toLocaleString('en', { minimumIntegerDigits: 2 })

  if (parseInt(month) > 7) return accumulator

  const key = month
  if (accumulator[key] === undefined) {
    accumulator[key] = { '2019': 0, '2020': 0 }
  }
  accumulator[key][year] += 1
  return accumulator
}, {})

const sorted = Object.entries(counts)
  .map(([month, years]) => ({
    month,
    '2019': years['2019'],
    '2020': years['2020'],
  }))
  .sort((a, b) => a.month.localeCompare(b.month))

const formated = csvFormat(sorted)

fs.writeFileSync(path.join(__dirname, '../public/counts.csv'), formated, 'utf8')

console.log('done')
