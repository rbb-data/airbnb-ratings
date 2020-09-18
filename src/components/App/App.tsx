import DotSwarm from 'components/DotSwarm/DotSwarm'
import PlayButton from 'components/_shared/PlayButton/PlayButton'
/* global fetch */

import React, { useState, useEffect } from 'react'
import 'whatwg-fetch'
import { csvParse } from 'd3-dsv'
import { getISOWeek } from 'date-fns'

import _ from './App.module.sass'
import useAutoStepper from 'lib/hooks/useAutoStepper'
import Histogram from 'components/Histogram/Histogram'

// this is the blue from the new styleguide it is not yet in the starter
const defaultBlue = '#0c5382'

const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

interface Count {
  day: string
  counts: string
}
function App() {
  const [counts, setCounts] = useState<Count[]>([])
  const [currentDayIndex, setCurrentDayIndex] = useState(26)
  const [isAnimating, setIsAnimating] = useState(false)
  useAutoStepper(
    isAnimating,
    () => {
      setCurrentDayIndex((currentDayIndex + 1) % counts.length)
      return currentDayIndex === counts.length - 2 ? 3000 : 400
    },
    0
  )

  useEffect(() => {
    async function fetchCounts() {
      const res = await fetch(`${window.location}/counts.csv`)
      const str = await res.text()
      const arr = (csvParse(str) as unknown) as Count[]
      setCounts(arr)
    }

    fetchCounts()
  }, [])
  // ⬆️ the second parameter to useEffect are its dependencies
  //  if the array is empty it runs only once otherwise it runs when depencies change

  const currentCount = counts[currentDayIndex]
  if (currentCount === undefined) return null

  const currentDate = new Date(currentCount.day)

  return (
    <article className={_.app}>
      <legend className={_.legend}>
        <span />= 1 Bewertung
      </legend>
      <div className={_.dotsWrapper}>
        <DotSwarm
          width={350}
          height={350}
          count={parseInt(currentCount.counts)}
          radius={1.5}
          color={defaultBlue}
        />
      </div>
      <h2 className={_.title}>
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        <span>
          Woche {getISOWeek(currentDate)}: {currentCount.counts} Bewertungen
        </span>
      </h2>

      <div className={_.controlls}>
        <PlayButton
          showStopIcon={isAnimating}
          onClick={() => {
            if (currentDayIndex >= counts.length - 1) setCurrentDayIndex(0)
            setIsAnimating(!isAnimating)
          }}
        />
        <Histogram
          onClick={(idx) => {
            setIsAnimating(false)
            setCurrentDayIndex(idx)
          }}
          values={counts.map((c) => parseInt(c.counts))}
          max={4492}
          highlight={currentDayIndex}
        />
      </div>
    </article>
  )
}

export default App
