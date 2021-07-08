import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import Input from '../Input'
import { DownIcon, LoadingIcon } from '../Icon'
import debounce from '../utils/debounce'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import Option from './Option'
import isEmpty from '../utils/isEmpty'
import Empty from '../Empty'

type Props = {
  className?: string
  defaultValue?: React.ReactText
  value?: React.ReactText
  visible?: boolean
  position?: 'top' | 'bottom'
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
  placeholder?: string
  size?: 'default' | 'small' | 'large'
  popupContainerClassName?: string
  extraLabelValue?: string // 额外的展示信息
  notFoundContent?: React.ReactNode
  onPanelVisibleChange?: (val?: boolean) => void
  onChange?: (value: any) => void
  getPopupContainer?: () => Element
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>

export type SelectProps = Props & NativeAttrs

const Select: React.FC<SelectProps> = React.memo(props => {
  const {
    className,
    style,
    defaultValue,
    value: propValue,
    visible: propVisible,
    extraLabelValue = '',
    loading,
    disabled,
    allowClear,
    children,
    placeholder,
    size,
    popupContainerClassName,
    position = 'bottom',
    notFoundContent = <Empty />,
    getPopupContainer = () => document.body,
    onChange,
    onPanelVisibleChange,
    ...attr
  } = props

  const [selectedValue, setSelectedValue] = useState<React.ReactText>(propValue || defaultValue || '')
  const [, setRefresh] = useState({})

  const visibleRef = useRef(propVisible)

  const [positionOptions, setPositionOptions] = useState({
    left: 0,
    top: 0,
    width: 0
  })

  const selectRef = useRef<HTMLDivElement | null>(null)
  const triggerWrapper = useRef<HTMLDivElement | null>(null)
  const wrapper = useRef<any>()

  useEffect(() => {
    if (propValue !== undefined) {
      setSelectedValue(propValue)
      return
    }

    if (defaultValue !== undefined) {
      setSelectedValue(defaultValue)
      return
    }
  }, [defaultValue, propValue])

  const setVisible = useCallback((visible: boolean, force = true) => {
    visibleRef.current = visible
    force && setRefresh({})
  }, [])

  const handleChange = (value: string) => {
    if (isEmpty(propValue)) setSelectedValue(value)

    setVisible(false)
    onPanelVisibleChange && onPanelVisibleChange(false)
    onChange && onChange(value)
  }

  useEffect(() => {
    if (visibleRef.current) {
      scrollIntoViewIfNeeded(wrapper.current, {
        scrollMode: 'if-needed',
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [positionOptions])

  const getWrapperBounding = () => {
    const element = triggerWrapper.current
    if (!element) return { left: 0, top: 0, width: 0 }

    const { width, height, top, left } = element.getBoundingClientRect()
    const { height: wrapperHeight } = wrapper.current.getBoundingClientRect()

    const { scrollX, scrollY } = window

    const positions = {
      top: {
        top: top + scrollY - wrapperHeight - 10,
        left: left + scrollX,
        width
      },
      bottom: {
        top: top + height + scrollY,
        left: left + scrollX,
        width
      }
    }
    return positions[position]
  }

  const setWrapperBounding = () => {
    const { left, top, width } = getWrapperBounding()
    setPositionOptions({ left, top, width })
  }

  const onResizeHandler = debounce(() => {
    setWrapperBounding()
  }, 500)

  const onClickOutside = useCallback(
    e => {
      e.stopPropagation()
      if (
        visibleRef.current &&
        !disabled &&
        selectRef.current &&
        !selectRef.current.contains(e.target) &&
        !e.target.classList.contains('planet-select-option-disabled')
      ) {
        setVisible(false)
        onPanelVisibleChange && onPanelVisibleChange(false)
      }
    },
    [disabled, setVisible, onPanelVisibleChange]
  )

  useEffect(() => {
    propVisible && setWrapperBounding()
    window.addEventListener('resize', onResizeHandler)
    window.addEventListener('click', onClickOutside)

    return () => {
      window.removeEventListener('resize', onResizeHandler)
      window.removeEventListener('click', onClickOutside)
    }
    // eslint-disable-next-line
  }, [propVisible, onClickOutside])

  const onClear = () => {
    setSelectedValue('')
    setVisible(false, false)
    onChange && onChange('')
  }

  const onClickHandler = () => {
    if (disabled) {
      return
    }

    setVisible(!visibleRef.current)
    onPanelVisibleChange && onPanelVisibleChange(visibleRef.current)
    if (visibleRef.current) {
      setWrapperBounding()
    }
  }

  return (
    <div className={classnames('planet-select', className)} style={style} ref={selectRef}>
      <div
        className={classnames('planet-select-inner', {
          'planet-select-active': visibleRef.current
        })}
        ref={triggerWrapper}
        onClick={onClickHandler}
        {...attr}
      >
        <Input
          disabled={disabled}
          readOnly
          placeholder={placeholder}
          className='planet-select-input'
          value={selectedValue + extraLabelValue}
          size={size}
          style={{
            width: style && style.width
          }}
          suffix={
            loading ? (
              <LoadingIcon className={`planet-select-loading`} />
            ) : (
              <DownIcon className='planet-select-arrow' />
            )
          }
          allowClear={allowClear}
          onClear={onClear}
        />
      </div>
      {createPortal(
        <div
          className={classnames('planet-select-content', popupContainerClassName, {
            'planet-select-open': visibleRef.current,
            'planet-select-close': !visibleRef.current
          })}
          ref={wrapper}
          style={positionOptions}
        >
          {children
            ? React.Children.map(children, (element, index) => {
                if (!React.isValidElement(element)) return null
                return React.cloneElement(element as any, {
                  key: index,
                  selectedValue: selectedValue,
                  onChange: handleChange
                })
              })
            : notFoundContent}
        </div>,
        getPopupContainer()
      )}
    </div>
  )
})

type SelectComponent<P = {}> = React.FC<P> & {
  Option: typeof Option
}

export default Select as SelectComponent<Props>
