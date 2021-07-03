import React from 'react'
import classNames from 'classnames'

type Type = 'default' | 'warning' | 'success' | 'error' | 'progress'

type Props = {
  type?: Type
  percent?: number
  showPercent?: boolean
  width?: number
  animation?: boolean
  circle?: boolean
  className?: string
  format?: (num: number) => void
}

const Progress: React.FC<Props> = props => {
  const {
    percent = 0,
    type = 'default',
    showPercent = true,
    animation = false,
    width = 100,
    className,
    circle,
    format
  } = props

  const getStrokeDasharray = (percent = 0.8, r = 50) => {
    const perimeter = Math.PI * 2 * r // 周长
    return `${perimeter * percent} ${perimeter * (1 - percent)}`
  }

  const percentInfo = `${percent}%`

  if (circle) {
    const cx = width / 2
    const cy = width / 2
    const r = width / 2 - 3
    return (
      <div className={classNames('planet-progress-circle-wrapper', className, `planet-progress-${type}`)}>
        <svg
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
          className={`planet-progress-circle`}
        >
          <circle cx={cx} cy={cy} r={r} className='planet-progress-circle-bg' />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            className={`planet-progress-circle-stroke-${type}`}
            strokeDasharray={getStrokeDasharray(percent / 100, r)}
          />
        </svg>
        <div className={`planet-progress-circle-percent`}>{(format && format(percent)) || percentInfo}</div>
      </div>
    )
  }

  return (
    <div className={classNames('planet-progress', className, `planet-progress-${type}`)}>
      <div className='planet-progress-enter'>
        <div
          className={classNames('planet-progress-bg', {
            'planet-progress-bg-animation': animation
          })}
          style={{ width: percentInfo }}
        />
      </div>
      {showPercent && <div className='planet-progress-num'>{percentInfo}</div>}
    </div>
  )
}

export default React.memo(Progress)
