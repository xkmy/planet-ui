import React from 'react'
import classnames from 'classnames'
import { MessageType } from './Message'
import { ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from '../Icon'

export type MessageItemTypes = {
  key?: string
  className?: string
  darkTheme?: boolean
  visible?: boolean
  duration?: number
  style?: React.CSSProperties
  type?: MessageType
  title?: React.ReactNode
  titleClassName?: string
  onClose?: () => void
}

const MessageItem: React.FC<MessageItemTypes> = ({
  className,
  darkTheme,
  visible,
  duration,
  style,
  type,
  title,
  titleClassName
}) => {
  return (
    <div
      className={classnames(
        'planet-message',
        className,
        { 'planet-message-theme-dark': darkTheme },
        { 'planet-message-open': visible && duration },
        { 'planet-message-close': !visible }
      )}
      style={style}
    >
      <div className={classnames('planet-message-title-custom', `planet-message-${type}`)}>
        <div className='planet-message-icon'>
          {type === 'info' ? <InfoIcon /> : undefined}
          {type === 'success' ? <SuccessIcon /> : undefined}
          {type === 'error' ? <ErrorIcon /> : undefined}
          {type === 'warning' ? <WarningIcon /> : undefined}
          {type === 'loading' ? <LoadingIcon /> : undefined}
        </div>

        <div className={classnames('planet-message-title', titleClassName)}>
          <span>{title}</span>
        </div>
      </div>
    </div>
  )
}
export default React.memo(MessageItem)
