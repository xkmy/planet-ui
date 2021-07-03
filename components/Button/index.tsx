import React from 'react'
import classnames from 'classnames'
import { LoadingIcon } from '../Icon'

const sizes = {
  small: 'small',
  default: 'default',
  large: 'large'
}

export type ButtonType = 'default' | 'warning' | 'primary' | 'success' | 'error' | 'info'

export type ButtonSize = 'small' | 'default' | 'large'

export type ButtonHtmlType = 'submit' | 'button' | 'reset'

type Props = {
  className?: string
  href?: string
  type?: ButtonType
  htmlType?: ButtonHtmlType
  size?: ButtonSize
  loading?: boolean
  block?: boolean
  disabled?: boolean
  hollow?: boolean
  dashed?: boolean
  circle?: boolean
  plain?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = (props: Props) => {
  const {
    className,
    href,
    type = 'default',
    htmlType = 'button',
    size = 'default',
    loading,
    block,
    disabled = false,
    hollow,
    dashed,
    circle,
    plain,
    children,
    onClick,
    ...params
  } = props

  const isDisabled = disabled || loading ? { disabled: true } : { onClick }

  const baseProps = {
    ...params,
    ...isDisabled,
    type: htmlType,
    className: classnames('planet-button', className, {
      [`planet-button-${type}`]: type,
      'planet-button-default': !disabled && type === 'default',
      'planet-button-normal': type === 'default',
      'planet-button-disabled': disabled,
      'planet-button-loading': loading,
      'planet-button-block': block,
      'planet-button-hollow': hollow,
      'planet-button-dashed': dashed,
      'planet-button-circle': circle,
      'planet-button-plain': plain,
      [`planet-button-size-${size}`]: size !== sizes.default
    })
  }

  const content = (
    <>
      {loading && !circle ? <LoadingIcon className='planet-loading' /> : null}
      <span>{children}</span>
    </>
  )

  return (
    <>
      {href ? (
        <a
          href={disabled ? 'javascript:void(0);' : href}
          className={classnames('planet-button-link', className, {
            'planet-button-link-disabled': disabled
          })}
          {...params}
        >
          {content}
        </a>
      ) : (
        <button {...baseProps}>{content}</button>
      )}
    </>
  )
}

export default React.memo(Button)
