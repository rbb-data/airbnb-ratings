import DotSwarm from 'components/DotSwarm/DotSwarm'
import PlayButton from 'components/_shared/PlayButton/PlayButton'
/* global fetch */

import React, { useState, useEffect } from 'react'
import 'whatwg-fetch'
import { csvParse } from 'd3-dsv'
import _ from './App.module.sass'
import useAutoStepper from 'lib/hooks/useAutoStepper'
import Histogram from 'components/Histogram/Histogram'

// this is the blue from the new styleguide it is not yet in the starter
const defaultBlue = '#0c5382'

interface Count {
  day: string
  counts: string
}
function App() {
  const [counts, setCounts] = useState<Count[]>([])
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  useAutoStepper(
    isAnimating,
    () => {
      if (currentDayIndex === counts.length - 1) {
        setIsAnimating(false)
        return false
      } else {
        setCurrentDayIndex(currentDayIndex + 1)
        return 500
      }
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

  return (
    <article className={_.app}>
      <h2 className={_.title}>{currentCount.day}</h2>

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
            setCurrentDayIndex(idx)
          }}
          values={counts.map((c) => parseInt(c.counts))}
          max={3000}
          highlight={currentDayIndex}
        />
      </div>
    </article>
  )
}

export default App
