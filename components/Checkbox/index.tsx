import React, { useState, useEffect } from 'react'
import classnames from 'classnames'

type Props = {
  className?: string
  defaultChecked?: boolean
  indeterminate?: boolean
  value?: string
  checked?: boolean
  disabled?: boolean
  isButton?: boolean
  size?: 'default' | 'small' | 'large'
  children?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<Props> = props => {
  const {
    className,
    defaultChecked,
    indeterminate,
    disabled,
    value,
    checked: propChecked = false,
    isButton,
    children,
    onChange,
    size = 'default'
  } = props

  const [checked, setChecked] = useState(propChecked || defaultChecked || false)

  useEffect(() => {
    setChecked(propChecked)
  }, [propChecked])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!propChecked) setChecked(e.target.checked)
    onChange && onChange(e)
  }

  return (
    <label
      className={classnames('planet-checkbox-wrapper', {
        'planet-checkbox-button-wrapper': isButton,
        'planet-checkbox-checked': checked,
        'planet-checkbox-disabled': disabled,
        // TODO: 修改 indeterminate
        'planet-checkbox-indeterminate': checked && indeterminate,
        [`planet-checkbox-${size}`]: isButton
      })}
    >
      <span
        className={classnames('planet-checkbox', className, {
          'planet-checkbox-button': isButton
        })}
      >
        <input
          type='checkbox'
          value={value}
          checked={checked}
          className='planet-checkbox-input'
          onChange={handleChange}
          disabled={disabled}
        />
        <span className='planet-checkbox-inner' />
      </span>
      <span>{children}</span>
    </label>
  )
}

export default React.memo(Checkbox)
