import React from 'react'
import { Placements, Theme, Trigger } from '../types/types'
import ToolTip from '../ToolTip'
import classnames from 'classnames'
import { useState } from 'react'
import { useEffect } from 'react'

type Props = {
  className?: string
  visible?: boolean
  position?: Placements
  title?: React.ReactNode
  content?: React.ReactNode
  theme?: Theme
  trigger?: Trigger
  disabled?: boolean
  hiddenArrow?: boolean
  wrapperClassName?: string
  onVisibleChange?: (visible: boolean) => void
}

const Popover: React.FC<Props> = React.memo(
  ({
    className,
    visible: propVisible,
    disabled,
    hiddenArrow,
    title,
    content,
    children,
    position = 'top',
    theme = 'light',
    trigger = 'hover',
    wrapperClassName,
    onVisibleChange
  }) => {
    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
      if (propVisible !== undefined) {
        setVisible(propVisible)
      }
    }, [propVisible])

    const handleVisibleChange = (visible: boolean) => {
      console.log('visible', visible)

      if (propVisible !== undefined) {
        onVisibleChange?.(visible)
      } else {
        setVisible(visible)
      }
    }

    return (
      <div className={classnames('planet-popover', className)}>
        <ToolTip
          theme={theme}
          visible={visible}
          trigger={trigger}
          disabled={disabled}
          hiddenArrow={hiddenArrow}
          title={
            <>
              {title && <div className='planet-popover-title'>{title}</div>}
              {content && <div className='planet-popover-content'>{content}</div>}
            </>
          }
          position={position}
          onVisibleChange={handleVisibleChange}
          wrapperClassName={classnames('planet-popover-wrapper', wrapperClassName)}
        >
          {children}
        </ToolTip>
      </div>
    )
  }
)

export default Popover
