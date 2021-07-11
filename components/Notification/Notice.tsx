import React from 'react'
import classnames from 'classnames'
import { CloseIcon, ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from '../Icon'
import { NotificationProps } from './types'

export type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const Notice: React.FC<NotificationProps> = props => {
  const { className, darkTheme, title, closable = true, type, style, content, onClick, onClose } = props

  const handleClose = () => {
    onClose && onClose(props)
  }

  return (
    <div
      className={classnames('planet-notification', className, {
        [`planet-notification-theme-dark`]: darkTheme
      })}
      style={{
        ...style
      }}
      onClick={onClick}
    >
      {closable && (
        <div className='planet-notification-close-btn' onClick={handleClose}>
          <CloseIcon />
        </div>
      )}

      <div className={classnames('planet-notification-icon', `${'planet-notification'}-${type}`)}>
        {type === 'info' ? <InfoIcon /> : undefined}
        {type === 'success' ? <SuccessIcon /> : undefined}
        {type === 'error' ? <ErrorIcon /> : undefined}
        {type === 'warning' ? <WarningIcon /> : undefined}
        {type === 'loading' ? <LoadingIcon /> : undefined}
      </div>
      <div className={classnames(`${'planet-notification'}-title-custom`)}>
        <div className={`${'planet-notification'}-title`}>
          <span>{title}</span>
        </div>
        <div className={`${'planet-notification'}-message`}>{content}</div>
      </div>
    </div>
  )
}
export default React.memo(Notice)
