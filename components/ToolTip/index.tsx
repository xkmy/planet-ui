import React, { useState, useRef, useEffect, useCallback } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import classnames from 'classnames'
import { useClickOther } from '../hooks'
import TooltipPortal from './ToolTipPortal'
import { CSSTransition } from 'react-transition-group'
import { Placements, Theme, Trigger } from '../types/types'
import { TIME_OUT } from '../constants/constants'
import useToolTip from './useToolTip'

export type ToolTipProps = {
  className?: string
  position?: Placements
  title?: React.ReactNode
  trigger?: Trigger
  theme?: Theme
  hiddenArrow?: boolean
  disabled?: boolean
  visible?: boolean
  wrapperClassName?: string
  children?: React.ReactNode
  onVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement
}

const ToolTip: React.FC<ToolTipProps> = props => {
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

  const [visible, setVisible] = useState<boolean | null>(propVisible || null)
  // const [positionInfo, setPositionInfo] = useState({
  //   left: 0,
  //   top: 0
  // })

  // const wrapperRef = useRef<HTMLDivElement | null>(null)
  // const triggerWrapper = useRef<HTMLDivElement | null>(null)
  const toggleContainer = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  const { wrapperRef, triggerWrapper, positionInfo, setWrapperBounding } = useToolTip({
    position
  })

  // const setWrapperBounding = useCallback(() => {
  //   const positions = getWrapperBounding(triggerWrapper.current, wrapperRef.current)
  //   if (positions) {
  //     const { left, top } = positions
  //     setPositionInfo(positionInfo => ({ ...positionInfo, left, top }))
  //   }
  // }, [getWrapperBounding])

  useEffect(() => {
    if (propVisible !== undefined) {
      setVisible(propVisible)
      if (propVisible) {
        setWrapperBounding()
      }
    }
  }, [propVisible, setWrapperBounding])

  const onOpenTooltip = () => {
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
    closeTimer.current = setTimeout(() => {
      unstable_batchedUpdates(() => {
        setVisible(false)
        onVisibleChange && onVisibleChange(false)
      })
    }, closeTimeDelay)
  }

  const toggleShowToolTip = () => {
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

  // useEffect(() => {
  //   const onResizeHandler = debounce(() => {
  //     setWrapperBounding()
  //   }, 500)

  //   window.addEventListener('resize', onResizeHandler)

  //   return () => {
  //     window.removeEventListener('resize', onResizeHandler)
  //   }
  // }, [setWrapperBounding])

  useClickOther(toggleContainer, e => {
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
        <CSSTransition classNames='planet-tooltip' timeout={TIME_OUT}>
          <div
            className={classnames(
              'planet-tooltip-wrapper',
              `planet-tooltip-position-${position}`,
              `planet-tooltip-${theme}`,
              wrapperClassName,
              {
                'planet-tooltip-show': visible,
                'planet-tooltip-hide': !visible,
                'planet-tooltip-hidden-arrow': hiddenArrow
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
        </CSSTransition>
      </TooltipPortal>
      <span onClick={toggleShowToolTip} ref={triggerWrapper} className='planet-tooltip-trigger-wrapper'>
        {children}
      </span>
    </div>
  )
}

export default React.memo(ToolTip)
