import React from 'react'
import classnames from 'classnames'

type Props = {
  separator?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: () => void
}

const BreadcrumbItem: React.FC<Props> = ({ separator, className, style, children, onClick }) => {
  return (
    <span style={style} className={classnames('planet-breadcrumb-item', className)} onClick={onClick}>
      <span className='planet-breadcrumb-item-text'>{children}</span>
      <span className='planet-breadcrumb-item-separator'>{separator}</span>
    </span>
  )
}

export default React.memo(BreadcrumbItem)
