import React, { useState, useImperativeHandle, forwardRef, Ref } from 'react'
import { useMemo } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Notice from './Notice'
import classNames from 'classnames'
import { TIME_OUT } from '../constants/constants'
import { NotificationOption, NotificationProps, Props } from './types'

const POSITION_MAP: { [props: string]: string } = {
  'top-left': 'left',
  'bottom-left': 'left',
  'top-right': 'right',
  'bottom-right': 'right'
}

const Notification = forwardRef(({ position, timeOut }: Props, ref: Ref<NotificationOption>) => {
  const [notices, setNotices] = useState<NotificationProps[]>([])

  const getNoticeKey = () => {
    return `notice-${new Date().getTime()}-${notices.length}`
  }

  const removeNotice = (key?: string, autoRunClose = true) => {
    setNotices(notices =>
      notices.filter(notice => {
        if (notice.key === key) {
          if (notice.onClose && autoRunClose) setTimeout(notice.onClose, timeOut || TIME_OUT)
          return false
        }
        return true
      })
    )
  }

  const addNotice = (notice: NotificationProps) => {
    const key = getNoticeKey()
    if (notices.every(item => item.key !== notice.key)) {
      setNotices([...notices, { ...notice, key }])

      if (notice.duration !== 0) {
        setTimeout(() => {
          removeNotice(key as string)
        }, (notice.duration || 3) * 1000)
      }
    }

    return () => {
      removeNotice(key as string)
    }
  }

  const handleOnClose = (notice: NotificationProps) => {
    removeNotice(notice.key, false)
    notice.onClose && notice.onClose(notice)
  }

  useImperativeHandle(ref, () => {
    return {
      removeNotice,
      addNotice
    }
  })

  const offset = 20

  const getPositionStyle = useMemo(() => {
    let style: { [props: string]: string | number } = {
      top: offset
    }
    switch (position) {
      case 'top-right':
        style = {
          top: offset
        }
        break
      case 'top-left':
        style = {
          left: offset,
          top: offset
        }
        break
      case 'bottom-right':
        style = {
          bottom: offset
        }
        break
      case 'bottom-left':
        style = {
          bottom: offset,
          left: offset
        }
        break
      default:
        style = {
          top: offset
        }
        break
    }
    return style
  }, [offset, position])

  return (
    <TransitionGroup className='planet-notification-wrapper' style={getPositionStyle}>
      {notices.map(notice => (
        <CSSTransition
          key={notice.key}
          classNames={classNames(`planet-notification-${POSITION_MAP[position]}`)}
          timeout={timeOut || TIME_OUT}
        >
          <Notice {...notice} key={notice.key} onClose={() => handleOnClose(notice)} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  )
})

export default Notification
