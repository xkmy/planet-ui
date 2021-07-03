import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal, unstable_batchedUpdates } from 'react-dom'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import classnames from 'classnames'
import debounce from '../utils/debounce'
import { useClickOther } from '../hooks'

export const TooltipPortal = ({
  children,
  getPopupContainer,
  onChange
}: {
  children: React.ReactNode
  getPopupContainer: () => HTMLElement
  onChange: () => void
}) => {
  const elRef = useRef(document.createElement('div'))

  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elRef.current

    containerRef.current = getPopupContainer()
    containerRef.current.appendChild(element)

    if (onChange) onChange()

    return () => {
      containerRef.current && containerRef.current.removeChild(element)
    }
    // eslint-disable-next-line
  }, [])

  return createPortal(children, elRef.current)
}

export type TooltipThemes = 'dark' | 'light'

type Props = {
  className?: string
  position?: 'top' | 'right' | 'left' | 'bottom'
  title?: string
  trigger?: 'hover' | 'click'
  theme?: TooltipThemes
  hiddenArrow?: boolean
  disabled?: boolean
  visible?: boolean
  wrapperClassName?: string
  children?: React.ReactNode
  onVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement
}

const ToolTip: React.FC<Props> = props => {
  const {
    className,
    visible: propVisible,
    position = 'top',
    trigger = 'hover',
    theme = 'dark',
    disabled,
    title,
    hiddenArrow,
    wrapperClassName,
    children,
    onVisibleChange,
    getPopupContainer = () => document.body,
    ...attr
  } = props

  const closeTimeDelay = 100

  const [visible, setVisible] = useState<boolean | null>(null)

  const [positionInfo, setPositionInfo] = useState({
    left: 0,
    top: 0
  })

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const triggerWrapper = useRef<HTMLDivElement | null>(null)
  const toggleContainer = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  const getWrapperBounding = useCallback(() => {
    if (!triggerWrapper.current || !wrapperRef.current) return
    const { width, height, top, left } = triggerWrapper.current.getBoundingClientRect()
    const { height: wrapperHeight, width: wrapperWidth } = wrapperRef.current.getBoundingClientRect()

    const { scrollX, scrollY } = window

    const positions = {
      top: {
        top: top + scrollY - wrapperHeight + 8,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      bottom: {
        top: top + height + scrollY,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      left: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX - wrapperWidth
      },
      right: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX + width
      }
    }
    return positions[position]
  }, [position])

  const setWrapperBounding = useCallback(() => {
    const positions = getWrapperBounding()
    if (positions) {
      const { left, top } = positions
      setPositionInfo(positionInfo => ({ ...positionInfo, left, top }))
    }
  }, [getWrapperBounding])

  useEffect(() => {
    if (propVisible !== undefined) {
      setVisible(propVisible)
      if (propVisible) {
        setWrapperBounding()
      }
    }
  }, [propVisible, setWrapperBounding])

  const onOpenTooltip = () => {
    if (propVisible) {
      return
    }

    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
    }

    setVisible(true)
    setWrapperBounding()
    onVisibleChange && onVisibleChange(true)

    if (wrapperRef.current) {
      scrollIntoViewIfNeeded(wrapperRef.current, {
        scrollMode: 'if-needed',
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }

  const onCloseTooltip = () => {
    if (propVisible) {
      return
    }

    closeTimer.current = setTimeout(() => {
      unstable_batchedUpdates(() => {
        setVisible(false)
        onVisibleChange && onVisibleChange(false)
      })
    }, closeTimeDelay)
  }

  const toggleShowToolTip = () => {
    if (propVisible) {
      return
    }

    // 将要显示 tooltip
    if (!visible) {
      setWrapperBounding()
    }

    setVisible(!visible)
    onVisibleChange && onVisibleChange(true)
  }

  const onTooltipPortalChange = useCallback(() => {
    // 如果是默认展开
    if (visible) {
      setTimeout(() => {
        setWrapperBounding()
      })
    }
  }, [visible, setWrapperBounding])

  useEffect(() => {
    const onResizeHandler = debounce(() => {
      setWrapperBounding()
    }, 500)

    window.addEventListener('resize', onResizeHandler)

    return () => {
      window.removeEventListener('resize', onResizeHandler)
    }
  }, [setWrapperBounding])

  useClickOther(toggleContainer, e => {
    if (propVisible) {
      return
    }

    if (visible && wrapperRef.current && !wrapperRef.current.contains(e.target as any)) {
      setVisible(false)
      onVisibleChange && onVisibleChange(false)
    }
  })

  const isHover = trigger === 'hover'

  const bindTriggerEvents =
    !disabled &&
    (isHover
      ? {
          onMouseEnter: onOpenTooltip,
          onMouseLeave: onCloseTooltip
        }
      : undefined)

  return (
    <div
      ref={toggleContainer}
      className={classnames('planet-tooltip', className)}
      {...attr}
      {...bindTriggerEvents}
    >
      <TooltipPortal onChange={onTooltipPortalChange} getPopupContainer={getPopupContainer}>
        <div
          className={classnames(
            'planet-tooltip-wrapper',
            `planet-tooltip-position-${position}`,
            `planet-tooltip-${theme}`,
            wrapperClassName,
            {
              'planet-tooltip-show': visible,
              'planet-tooltip-hide': !visible,
              'planet-tooltip-hidden-arrow': hiddenArrow,
              'planet-tooltip-no-animate': visible === null // 第一次时隐藏
            }
          )}
          style={{
            left: positionInfo.left,
            top: positionInfo.top
          }}
          ref={wrapperRef}
          onMouseEnter={isHover ? onOpenTooltip : undefined}
          onMouseLeave={isHover ? onCloseTooltip : undefined}
        >
          {title}
        </div>
      </TooltipPortal>
      <span onClick={toggleShowToolTip} ref={triggerWrapper} className='planet-tooltip-trigger-wrapper'>
        {children}
      </span>
    </div>
  )
}

export default React.memo(ToolTip)
