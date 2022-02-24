import React from 'react'
import classNames from 'classnames'

type Props = {
  className?: string
  children: React.ReactNode
}

const Skeleton = ({ className, children }: Props) => {
  return <div className={classNames('planet-skeleton', className)}>{children}</div>
}

export default Skeleton
