import React, { useRef, useEffect, useCallback } from 'react'
import cls from 'classnames'
import TabPane from './TabPane'

type Props = {
  className?: string
  defaultActiveKey?: string
  activeKey?: string
  type?: 'card'
  tabBarExtraContent?: React.ReactNode
  children?: React.ReactNode
  onChange?: (active: string | number) => void
}

const Tabs: React.FC<Props> = React.memo(
  ({ className, activeKey, type, children, tabBarExtraContent, defaultActiveKey = 1, onChange }) => {
    const [active, setActive] = React.useState<string | number>(activeKey || defaultActiveKey)
    const [lineWidth, setLineWidth] = React.useState(0)
    const [lineOffsetLeft, setLineOffsetLeft] = React.useState(0)

    const tabsHeader = useRef<any>()
    const activeTabRef = useRef<any>()

    useEffect(() => {
      if (activeKey !== undefined) {
        setActive(Number(activeKey))
      }
    }, [activeKey])

    const setActiveLineStyle = useCallback(() => {
      if (activeTabRef.current) {
        const { width, left } = (activeTabRef.current && activeTabRef.current.getBoundingClientRect()) || {}
        const { left: headerOffset } =
          (tabsHeader.current && tabsHeader.current.getBoundingClientRect()) || {}
        setLineWidth(width)
        setLineOffsetLeft(left - headerOffset)
      }
    }, [])

    useEffect(() => {
      if (type !== 'card') {
        console.log('setActiveLineStyle')
        setActiveLineStyle()
      }
    }, [type, active, setActiveLineStyle])

    const onTabChange = (disabled: boolean) => (key: number) => () => {
      if (!disabled) {
        setActive(key)
        onChange?.(key)
      }
    }

    const content = React.Children.map(children, (element, index) => {
      if (!React.isValidElement(element)) return
      const key = (index + 1) >> 0
      return React.cloneElement(element, {
        active,
        visible: active === key,
        key: index
      })
    })

    const header = React.Children.map(children, (element: any, index) => {
      if (!React.isValidElement(element)) return

      const { tab, disabled } = element.props as any
      const key = (index + 1) >> 0
      const ref = active === key ? { ref: (node: any) => (activeTabRef.current = node) } : {}
      return (
        <div
          key={index}
          role='tab'
          aria-disabled={disabled}
          aria-selected={true}
          className={cls('planet-tabs-tab', {
            'planet-tabs-tab-active': active === key,
            'planet-tabs-tab-disabled': !!disabled
          })}
          {...ref}
          onClick={onTabChange(disabled)(key)}
        >
          {tab}
        </div>
      )
    })

    return (
      <div className={cls('planet-tabs', className)}>
        <div
          className={cls('planet-tabs-header', {
            'planet-tabs-card': type === 'card'
          })}
          ref={tabsHeader}
        >
          {header}
          {type !== 'card' && (
            <div
              className={cls('planet-tabs-line')}
              style={{
                width: lineWidth,
                transform: `translate3d(${lineOffsetLeft}px,0,0)`
              }}
            />
          )}
          {tabBarExtraContent && <div className='planet-tabs-extra'>{tabBarExtraContent}</div>}
        </div>
        <div className='planet-tabs-content'>{content}</div>
      </div>
    )
  }
)

type SelectComponent<P = {}> = React.FC<P> & {
  TabPane: typeof TabPane
}

export default Tabs as SelectComponent<Props>
