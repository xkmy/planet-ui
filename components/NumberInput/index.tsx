import React, { ChangeEvent, useEffect } from 'react'
import classnames from 'classnames'
import Input, { InputSize } from '../Input'
import { useState } from 'react'
import isEmpty from '../utils/isEmpty'

const DEFAULT_POINT = '.'
const DEFAULT_DECIMAL = 2

//保留 数字 和 小数点
export const getCleanString = (str: React.ReactText) => {
  return str.toString().replace(/[^\d|\\.]/g, '')
}

// 小数点限制
export const getLimitedDecimalPoint = (value = '', decimal?: number, point = DEFAULT_POINT) => {
  if (!decimal || !value.includes(point) || value.endsWith(point)) {
    return value
  }
  const first = value.slice(0, 1)
  const other = value.slice(1)
  return (
    first +
    other
      .split(point)
      .map(str => str.substr(0, decimal))
      .join(point)
  )
}

type Props = {
  defaultValue?: React.ReactText
  value?: React.ReactText
  className?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  showStepper?: boolean
  min?: number
  max?: number
  decimal?: number
  step?: number
  allowClear?: boolean
  size?: InputSize
  onClear?: () => void
  onChange?: (value: number) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const NumberInput: React.FC<Props> = props => {
  const {
    defaultValue,
    value: propValue,
    className,
    disabled,
    readOnly,
    placeholder,
    showStepper,
    allowClear,
    min = -Infinity,
    max = Infinity,
    step = 1,
    decimal,
    size,
    onChange,
    onKeyUp,
    onClear
  } = props

  const [value, setValue] = useState<React.ReactText>('')
  const [isDisabledSubTract, setIsDisabledSubTract] = useState(false)
  const [isDisabledAdd, setisDisabledAdd] = useState(false)

  useEffect(() => {
    if (defaultValue && isEmpty(propValue)) {
      setValue(getLimitedDecimalPoint(getCleanString(defaultValue), decimal))
      return
    }
    if (!isEmpty(propValue)) {
      setValue(propValue as React.ReactText)
    }
  }, [defaultValue, propValue, decimal])

  const setValueState = (value: React.ReactText) => {
    // 如果是非受控组件
    isEmpty(propValue) && setValue(value)
  }

  const getValue = (value: number) => {
    const _value = Math.min(max, Math.max(min, value))
    if (showStepper && _value.toString().includes(DEFAULT_POINT)) {
      return Number(_value.toFixed(decimal || DEFAULT_DECIMAL))
    }
    return Number(_value)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(getLimitedDecimalPoint(getCleanString(e.target.value), decimal))

    if (!isEmpty(value) && (value > max || value < min)) {
      setValueState(getValue(value))
      return
    }

    setValueState(value)
    onChange && onChange(value)
  }

  const handleClick = (type: 'add' | 'subtract') => {
    const newValue = type === 'add' ? getValue(Number(value) + step) : getValue(Number(value) - step)

    setIsDisabledSubTract(newValue === min)
    setisDisabledAdd(newValue === max)
    setValueState(newValue)
    onChange && onChange(newValue)
  }

  const handleClear = () => {
    setValue('')
    onClear && onClear()
  }

  return (
    <Input
      disabled={disabled}
      readOnly={readOnly}
      className={classnames('planet-number-input', className, {
        'planet-number-input-disabled': disabled
      })}
      placeholder={placeholder}
      onChange={handleChange}
      value={value.toString()}
      size={size}
      allowClear={allowClear}
      onClear={handleClear}
      onKeyUp={onKeyUp}
      addonBefore={
        showStepper && (
          <button
            className={classnames('planet-number-input-stepper', {
              'planet-number-input-disabled': isDisabledSubTract
            })}
            onClick={() => handleClick('subtract')}
            disabled={disabled}
          >
            -
          </button>
        )
      }
      addonAfter={
        showStepper && (
          <button
            className={classnames('planet-number-input-stepper', {
              'planet-number-input-disabled': isDisabledAdd
            })}
            onClick={() => handleClick('add')}
            disabled={disabled}
          >
            +
          </button>
        )
      }
      addonClassName={classnames(`planet-number-input-group`, {
        'planet-number-input-group-disabled': disabled,
        'planet-number-input-disabled-subtract': isDisabledSubTract,
        'planet-number-input-disabled-add': isDisabledAdd
      })}
      wrapperClassName='planet-number-input-wrapper'
    />
  )
}

export default React.memo(NumberInput)
