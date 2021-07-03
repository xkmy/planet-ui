import React, { useState } from 'react'
import classnames from 'classnames'
import { LoadingIcon } from '../Icon'

type Size = 'default' | 'large' | 'small'

type Props = {
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  loading?: boolean
  size?: Size
  className?: string
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  onChange?: (checked: boolean) => void
}

const Switch: React.FC<Props> = props => {
  const {
    defaultChecked,
    checked,
    size,
    loading,
    disabled,
    checkedChildren,
    unCheckedChildren,
    className,
    onChange
  } = props

  const [nowChecked, setNowChecked] = useState(checked || defaultChecked)

  const handleChange = () => {
    if (disabled || loading) {
      return
    }
    setNowChecked(!nowChecked)
    onChange && onChange(!nowChecked)
  }

  return (
    <span
      className={classnames('planet-switch', className, {
        'planet-switch-checked': nowChecked,
        'planet-switch-loading': loading,
        'planet-switch-disabled': disabled,
        [`planet-switch-${size}`]: !!size
      })}
      onClick={handleChange}
    >
      {loading ? (
        <span className='planet-switch-loading-icon'>
          <LoadingIcon />
        </span>
      ) : (
        <span className='planet-switch-inner'>{nowChecked ? checkedChildren : unCheckedChildren}</span>
      )}
    </span>
  )
}

export default React.memo(Switch)
