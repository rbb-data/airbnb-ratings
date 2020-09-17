import React from 'react'
import _ from './Histogram.module.sass'

const { lightBlue, blue } = { lightBlue: '#0c5382', blue: '#52b0ef' }

interface Props {
  onClick: (e: any) => void
  values: number[]
  max: number
  highlight: number
}
export default function Histogram(props: Props) {
  const { values, max, highlight, onClick } = props

  const normalizedValues = values.map((val) => val / max)

  const margin = 0.22

  return (
    <svg
      className={_.svg}
      viewBox={`0 0 ${values.length} 2.5`}
      width='100%'
      xmlns='http://www.w3.org/2000/svg'
    >
      {normalizedValues.map((val, i) => (
        <g key={i} onClick={() => onClick(i)}>
          <rect
            className={_.rect}
            x={i + margin}
            y={2.5 - val * 2.5}
            width={1 - 2 * margin}
            height={val * 2.5}
            fill={i === highlight ? blue : lightBlue}
          />
        </g>
      ))}
    </svg>
  )
}
