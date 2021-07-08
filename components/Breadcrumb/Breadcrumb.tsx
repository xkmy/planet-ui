import React from 'react'
import classnames from 'classnames'
import BreadcrumbItem from './BreadcrumbItem'

type Props = {
  className?: string
  /* 自定义指示器 */
  separator?: React.ReactNode
  style?: React.CSSProperties
}

const Breadcrumb: React.FC<Props> = React.memo(({ className, separator = '/', style, children }) => {
  return (
    <div style={style} className={classnames('planet-breadcrumb', className)}>
      {React.Children.map(children, (element, index) => {
        if (!React.isValidElement(element)) return

        return React.cloneElement(element, {
          /* 传递父组件的属性给子组件 */
          separator,
          key: index
        })
      })}
    </div>
  )
})

type BreadcrumbComponent<P = {}> = React.FC<P> & {
  Item: typeof BreadcrumbItem
}

export default Breadcrumb as BreadcrumbComponent<Props>
