import React from 'react'
import classnames from 'classnames'
import { LoadingIcon } from '../Icon'

type Props = {
  className?: string
  size?: 'small' | 'large'
  tip?: string
  loading?: boolean
  indicator?: React.ReactNode // 可自定义指示器
  children?: React.ReactNode
}

const Spin: React.FC<Props> = props => {
  const { loading = true, className, size = '', tip, children, indicator = <LoadingIcon /> } = props

  if (!loading) {
    return <>{children}</>
  }

  if (children) {
    return (
      <div className='planet-spin-container'>
        <div
          className={classnames('planet-spin', className, {
            'planet-spin-wrap': true
          })}
        >
          <span
            className={classnames(`planet-spin-indicator`, {
              [`planet-spin-${size}`]: size
            })}
          >
            {indicator}
          </span>
          {tip && <div className='planet-spin-tip'>{tip}</div>}
        </div>
        <div className='planet-spin-blur'>{children}</div>
      </div>
    )
  }

  return (
    <div className={classnames('planet-spin', className, 'planet-spin-spinning')}>
      <span
        className={classnames(`planet-spin-indicator`, {
          [`planet-spin-${size}`]: size
        })}
      >
        {indicator}
      </span>
    </div>
  )
}

export default React.memo(Spin)
