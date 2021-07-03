import React from 'react'
import classnames from 'classnames'

type Props = {
  className?: string
  disabled?: boolean
  value: React.ReactText
  selectedValue?: string
  children?: any
  onChange?: (value: React.ReactText, children?: React.ReactNode) => void
}

const Option: React.FC<Props> = ({ className, disabled, value, selectedValue, children, onChange }) => {
  const onClick = (value: React.ReactText, children: any) => {
    if (onChange) {
      onChange(value, children)
    }
  }
  const trim = (value = '') => {
    const _value = Array.prototype.join.call(value, '')
    return _value.replace(/\s/g, '')
  }

  return (
    <div
      className={classnames('planet-select-option', className, {
        'planet-select-option-selected': selectedValue === value || trim(selectedValue) === trim(children),
        'planet-select-option-disabled': disabled
      })}
      onClick={disabled ? undefined : () => onClick(value, children)}
    >
      {children}
    </div>
  )
}

export default React.memo(Option)
