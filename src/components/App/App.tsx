import DotSwarm from 'components/DotSwarm/DotSwarm'
import PlayButton from 'components/_shared/PlayButton/PlayButton'
/* global fetch */

import React, { useState, useEffect } from 'react'
import 'whatwg-fetch'
import { csvParse } from 'd3-dsv'
import _ from './App.module.sass'
import useAutoStepper from 'lib/hooks/useAutoStepper'

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
      <h2>{currentCount.day}</h2>

      <legend>
        <div style={{ display: 'flex' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '10px',
              backgroundColor: '#D5D5D5',
            }}
          />
          2019
        </div>
        <div>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '10px',
              backgroundColor: defaultBlue,
            }}
          />
          2020
        </div>
      </legend>
      <div
        style={{
          display: 'grid',
          gridTemplateAreas: '"right"',
          gridTemplateColumns: '1fr',
        }}
      >
        <div style={{ gridArea: 'right' }}>
          <DotSwarm
            width={300}
            height={300}
            count={parseInt(currentCount.counts)}
            radius={1.5}
            color={defaultBlue}
          />
        </div>
      </div>

      <PlayButton
        showStopIcon={isAnimating}
        onClick={() => {
          if (currentDayIndex >= counts.length - 1) setCurrentDayIndex(0)
          setIsAnimating(!isAnimating)
        }}
      />
      <input
        type='range'
        step={1}
        max={counts.length - 1}
        value={currentDayIndex}
        onChange={(e) => {
          setCurrentDayIndex(+e.target.value)
        }}
      />
    </article>
  )
}

export default App
