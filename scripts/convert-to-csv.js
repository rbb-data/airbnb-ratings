const { dsvFormat, csvFormat } = require('d3-dsv')
const fs = require('fs')
const path = require('path')
const rawData = fs.readFileSync(
  path.join(__dirname, '../raw/detailed-reviews-csv-17092020 2018-2020.csv'),
  'utf8'
)

function getWeek(d) {
  var date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  )
}

const parser = dsvFormat(',')
const csv = parser.parse(rawData)

const counts = csv.reduce((accumulator, currentValue) => {
  const date = new Date(currentValue.date)
  const year = date.getFullYear()
  const week = getWeek(date).toLocaleString('en', {
    minimumIntegerDigits: 2,
  })

  const yearNum = parseInt(year)
  if (yearNum < 2019 || (yearNum === 2019 && week < 30)) return accumulator

  const key = `${year}-${week}`
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
