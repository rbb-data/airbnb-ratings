import React from 'react'
import _ from './Histogram.module.sass'

const { lightBlue, blue } = { lightBlue: '#0c5382', blue: '#e31818' }

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
  const maxBarHeight = 5

  return (
    <svg
      className={_.svg}
      viewBox={`0 0 ${values.length} ${maxBarHeight + 1.2}`}
      width='100%'
      xmlns='http://www.w3.org/2000/svg'
    >
      {normalizedValues.map((val, i) => (
        <g key={i} onClick={() => onClick(i)}>
          <rect
            className={_.rect}
            x={i + margin}
            y={maxBarHeight - val * maxBarHeight}
            width={1 - 2 * margin}
            height={val * maxBarHeight}
            fill={i === highlight ? blue : lightBlue}
          />
          {i > 1 && i % 2 === 0 && (
            <text
              className={_.text}
              x={i + 0.5}
              y={maxBarHeight + 1.2}
              textAnchor='middle'
              fill={i === highlight ? blue : lightBlue}
            >
              {(i + 35) % 52}
            </text>
          )}
        </g>
      ))}
      <text
        className={_.text}
        x={0}
        y={maxBarHeight + 1.2}
        textAnchor='left'
        fill={lightBlue}
      >
        KW:
      </text>
    </svg>
  )
}
