import React from 'react'
import { EmptyIcon } from '../Icon'
import classNames from 'classnames'

type Props = {
  className?: string
  height?: number
  description?: React.ReactNode
  children?: React.ReactNode
  icon?: React.ReactNode
}

const Empty: React.FC<Props> = props => {
  const { className, children, description = '暂无数据', height = 200, icon = <EmptyIcon /> } = props

  return (
    <div
      className={classNames('planet-empty', className)}
      style={{
        height
      }}
    >
      <div className='planet-empty-icon'>{icon}</div>
      <div className='planet-empty-description'>{description}</div>
      {children}
    </div>
  )
}

export default React.memo(Empty)
