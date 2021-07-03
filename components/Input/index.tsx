import React, { useState, useRef, useEffect, isValidElement } from 'react'
import classnames from 'classnames'
import { CloseCircleIcon } from '../Icon'
import isEmpty from '../utils/isEmpty'
import isNotEmpty from '../utils/isNotEmpty'

export type InputSize = 'default' | 'small' | 'large'

export type InputType = 'text' | 'password' | 'range' | 'date' | 'number' | 'color' | 'email'

type Props = {
  defaultValue?: React.ReactText
  value?: React.ReactText
  size?: InputSize
  className?: string
  wrapperClassName?: string
  style?: React.CSSProperties
  disabled?: boolean
  type?: InputType
  placeholder?: string
  allowClear?: boolean
  readOnly?: boolean
  suffix?: React.ReactNode
  prefix?: React.ReactNode
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  addonClassName?: string
  onClick?: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClear?: () => void
}

const Input: React.FC<Props> = props => {
  const {
    size = 'default',
    type = 'text',
    defaultValue,
    className,
    wrapperClassName,
    style,
    allowClear,
    disabled,
    readOnly,
    suffix,
    prefix,
    placeholder,
    addonBefore,
    addonAfter,
    addonClassName,
    onClear,
    onClick,
    onChange,
    onKeyUp
  } = props

  const [value, setValue] = useState<React.ReactText>(props.value || defaultValue || '')

  const inputRef = useRef<any>()

  useEffect(() => {
    if (isNotEmpty(props.value)) {
      setValue(props.value as React.ReactText)
    }
  }, [props.value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isEmpty(props.value) && setValue(e.target.value)
    onChange && onChange(e)
  }

  const onClearValue = () => {
    setValue('')
    onClear && onClear()
  }

  const isShowWrapper = allowClear || isValidElement(prefix) || isValidElement(suffix)

  const hasSuffix = suffix || allowClear

  const inputElement = (
    <input
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      onClick={onClick && onClick}
      onChange={handleChange}
      onKeyUp={onKeyUp && onKeyUp}
      style={style}
      className={classnames('planet-input', className, {
        'planet-input-disabled': disabled,
        [`planet-input-${size}`]: size !== 'default'
      })}
      placeholder={placeholder}
      value={value}
      ref={inputRef}
    />
  )

  const inputWrapper = (
    <div
      className={classnames(`planet-input-wrapper`, wrapperClassName, {
        'planet-input-has-prefix': prefix,
        'planet-input-has-suffix': hasSuffix
      })}
    >
      {prefix && <span className='planet-input-prefix'>{prefix}</span>}
      {inputElement}
      {hasSuffix && (
        <span className='planet-input-suffix'>
          {allowClear && value ? (
            <CloseCircleIcon className={classnames(`planet-input-clear`)} onClick={onClearValue} />
          ) : (
            suffix
          )}
        </span>
      )}
    </div>
  )

  if (addonBefore || addonAfter) {
    return (
      <span
        className={classnames(
          `planet-input-group`,
          {
            'planet-input-group-addon-before': addonBefore,
            'planet-input-group-addon-after': addonAfter,
            'planet-input-group-addon-all': addonAfter && addonBefore,
            [`planet-input-group-${size}`]: size !== 'default'
          },
          addonClassName
        )}
      >
        {addonBefore && <span className='planet-input-group-addon'>{addonBefore}</span>}
        {(isShowWrapper && inputWrapper) || inputElement}
        {addonAfter && <span className='planet-input-group-addon'>{addonAfter}</span>}
      </span>
    )
  }

  if (isShowWrapper) {
    return inputWrapper
  }
  return inputElement
}

export default React.memo(Input)
