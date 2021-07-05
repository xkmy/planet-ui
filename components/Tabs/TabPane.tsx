import React from 'react'
import cls from 'classnames'

type Props = {
  tab?: React.ReactNode
  className?: string
  children?: React.ReactNode
  visible?: boolean
  activeKey?: string | number
}

const TabPanel: React.FC<Props> = ({ className, children, visible }) => {
  return visible ? <div className={cls('planet-tabs-panel', className)}>{children}</div> : null
}

export default TabPanel
