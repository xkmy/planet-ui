import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../Icon'
import React, { useState } from 'react'
import { Type } from '../types/types'
import classnames from 'classnames'

const ICON_MAP = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />
}

type Props = {
  className?: string
  closeText?: React.ReactNode
  type?: Type
  animateTime?: number
  message?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClose?: () => void
}

const Alert: React.FC<Props> = ({
  className,
  closeText,
  animateTime,
  type = 'success',
  message,
  description,
  closable,
  showIcon,
  style,
  onClick,
  onClose
}) => {
  const [visible, setVisible] = useState(true)
  const [animation, setAnimation] = useState(false)

  const handleClose = () => {
    setAnimation(true)
    setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, animateTime || 500)
  }

  return visible ? (
    <div
      className={classnames('planet-alert', className, `planet-alert-${type}`, {
        'has-description': description,
        'planet-alert-hide': animation
      })}
      style={style}
      onClick={onClick}
    >
      <div className='planet-alert-message'>
        {showIcon ? <span className='planet-alert-icon'>{ICON_MAP[type] || <SuccessIcon />}</span> : null}
        <span>{message}</span>
        {closable ? (
          <span className='planet-alert-close' onClick={handleClose}>
            {closeText ? closeText : <CloseIcon />}
          </span>
        ) : null}
      </div>
      {description ? <div className='planet-alert-description'>{description}</div> : null}
    </div>
  ) : null
}

export default React.memo(Alert)
