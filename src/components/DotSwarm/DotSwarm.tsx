import React, { useMemo } from 'react'
import { forceSimulation, forceX, forceY } from 'd3-force'
import { Point } from 'lib/globalTypes'

function createNameDotsCluster(
  width: number,
  height: number,
  count: number
): Point[] {
  const children: any[] = Array.from(Array(count).keys()).map(() => ({}))

  const simulation: any = forceSimulation(children)
    .stop()
    .force('x', forceX(0).strength(1.3))
    .force('y', forceY(0).strength(1.3))
    .tick(1)

  return simulation
    .nodes()
    .map((node: any) => [node.x + width / 2, node.y + height / 2])
}

interface Props {
  width: number
  height: number
  count: number
  radius: number
  color: string
}
function DotSwarm(props: Props) {
  const { width, height, count, radius, color } = props

  const dots = useMemo(() => createNameDotsCluster(width, height, 4500), [
    width,
    height,
  ])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <g>
        {dots.map((dot, j) => (
          <circle
            style={{ transition: 'fill 0.7s linear' }}
            key={j}
            cx={dot[0]}
            cy={dot[1]}
            r={radius}
            fill={j < count ? color : '#fff'}
          />
        ))}
      </g>
    </svg>
  )
}

export default DotSwarm
