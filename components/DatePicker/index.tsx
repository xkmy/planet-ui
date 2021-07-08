import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import cls from 'classnames'
import Input from '../Input'
import Spin from '../Spin'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import dayjs, { Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import debounce from '../utils/debounce'
import { CalendarIcon } from '../Icon'
import { useClickOther } from '../hooks'
import DatePickerHeader from './DatePickerHeader'
import DatePickerFooter from './DatePickerFooter'
import { WEEKDAY, WEEKDAYS } from './constants'
import { DatePickerProps } from './types'

dayjs.extend(isoWeek)

const DatePicker: React.FC<DatePickerProps> = props => {
  const {
    value,
    defaultValue,
    className,
    format = 'YYYY-MM-DD',
    placeholder = '请选择',
    showToday = true,
    allowClear = true,
    showDayInPrevMonth = true,
    showDayInNextMonth = true,
    tip,
    loading = false,
    disabled,
    position = 'bottom',
    suffix = <CalendarIcon />,
    size = 'default',
    popupContainerClassName,
    extraFooter,
    style,
    onChange,
    onPanelVisibleChange,
    disabledDate = () => false,
    getPopupContainer = () => document.body
  } = props

  const [selectedDate, setSelectedDate] = useState<Dayjs>(value || defaultValue || dayjs())
  const [selectedTemplate, setSelectedTemplate] = useState<Dayjs>(value || defaultValue || dayjs())
  const [visible, setVisible] = useState<boolean | null>(null)
  const [isSelectedMoment, setIsSelectedMoment] = useState<boolean>(!!(value || defaultValue))
  const [positionOptions, setPositionOptions] = useState({
    left: 0,
    top: 0,
    width: 0
  })

  const toggleContainer = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const triggerWrapper = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value)
    }
  }, [value])

  useEffect(() => {
    if (visible && wrapperRef.current) {
      scrollIntoViewIfNeeded(wrapperRef.current, {
        scrollMode: 'if-needed',
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [visible])

  const getWrapperBounding = () => {
    if (!triggerWrapper.current || !wrapperRef.current) return { top: 0, left: 0 }

    const { height, top, left } = triggerWrapper.current.getBoundingClientRect()
    const { height: eleHeight = 0 } = wrapperRef.current.getBoundingClientRect()

    const { scrollY } = window

    const positions = {
      top: {
        top: top + scrollY - eleHeight - 10,
        left: left - 0.5
      },
      bottom: {
        top: top + height + scrollY,
        left: left - 0.5
      }
    }
    return positions[position]
  }

  const setWrapperBounding = () => {
    const { left, top } = getWrapperBounding()
    setPositionOptions({ ...positionOptions, left, top })
  }

  const onTogglePanel = () => {
    if (!visible) {
      setWrapperBounding()
    }
    setVisible(!visible)
    onPanelVisibleChange?.(!visible)
  }

  const addMonth = useCallback(() => {
    setSelectedDate(selectedDate => selectedDate.clone().add(1, 'month'))
  }, [])

  const subtractMonth = useCallback(() => {
    setSelectedDate(selectedDate => selectedDate.clone().subtract(1, 'month'))
  }, [])

  const handleSelectedDate = (date: number, isNextMonth?: boolean) => {
    let selected = selectedDate.clone()
    /* 如果是切换月份 */
    if (isNextMonth === true) {
      selected.add(1, 'month').date(date)
    } else if (isNextMonth === false) {
      selected.subtract(1, 'month').date(date)
    } else {
      /* 否则设置日期 */
      selected = selected.date(date)
    }

    setSelectedDate(selected)
    setSelectedTemplate(selected.clone())
    setVisible(false)
    setIsSelectedMoment(true)

    onPanelVisibleChange?.(false)
    onChange?.(selected, selected.format(format))
  }

  const onSelectToday = () => {
    const now = dayjs()
    setSelectedDate(now)

    handleSelectedDate(now.date())
  }

  const renderPrevDays = (firstDay: Dayjs) => {
    const weekdayInMonth = firstDay.isoWeekday()
    const dayOfFirstDate: number = firstDay.day()
    const lastMonth: Dayjs = firstDay.clone().add(-1, 'months')
    const lastMonthDaysInMonth: number = lastMonth.daysInMonth()

    return new Array(weekdayInMonth - 1).fill(0).map((_, i) => {
      const date =
        dayOfFirstDate === 0
          ? lastMonthDaysInMonth - WEEKDAY + i + 2
          : lastMonthDaysInMonth - dayOfFirstDate + i + 2
      const isDisabled = disabledDate(firstDay.clone().date(i + 1))

      return (
        <span
          className={cls('planet-date-picker-item', 'planet-date-picker-last-month', {
            'planet-date-picker-disabled-date': isDisabled
          })}
          key={`first-date-${i}`}
          onClick={!isDisabled ? () => handleSelectedDate(date, false) : undefined}
        >
          {showDayInPrevMonth && date}
        </span>
      )
    })
  }

  const renderDateContent = (firstDay: Dayjs) => {
    const daysInMonth = firstDay.daysInMonth()

    return new Array(daysInMonth).fill(null).map((_, i) => {
      const currentDate = i + 1
      const isDisabled = disabledDate(firstDay.clone().date(currentDate))
      return (
        <span
          className={cls('planet-date-picker-item', 'planet-date-picker-month', {
            'planet-date-picker-selected-date': selectedDate.date() === currentDate,
            'planet-date-picker-disabled-date': isDisabled
          })}
          key={`date-${i}`}
          onClick={!isDisabled ? () => handleSelectedDate(currentDate) : undefined}
        >
          {currentDate}
        </span>
      )
    })
  }

  const renderNextDays = (firstDay: Dayjs) => {
    const daysInMonth = firstDay.daysInMonth()
    const weekdayInMonth = firstDay.isoWeekday()

    const lastDaysInMonth = (daysInMonth + weekdayInMonth - 1) % WEEKDAY

    return new Array(lastDaysInMonth === 0 ? 0 : WEEKDAY - lastDaysInMonth).fill(null).map((_, date) => {
      const currentDate = date + 1
      const isDisabled = disabledDate(firstDay.clone().add(1, 'month').date(currentDate))

      return (
        <span
          className={cls('planet-date-picker-item', 'planet-date-picker-next-month', {
            'planet-date-picker-disabled-date': isDisabled
          })}
          key={`next-date-${date}`}
          onClick={
            showDayInNextMonth && !isDisabled ? () => handleSelectedDate(currentDate, true) : undefined
          }
        >
          {showDayInNextMonth && currentDate}
        </span>
      )
    })
  }

  const renderDates = () => {
    const firstDay: Dayjs = selectedDate.clone().date(1)
    return (
      <>
        <div>
          {WEEKDAYS.map(day => (
            <span className='planet-date-picker-item planet-date-picker-day-title' key={day}>
              {day}
            </span>
          ))}
        </div>
        {renderPrevDays(firstDay)}
        {renderDateContent(firstDay)}
        {renderNextDays(firstDay)}
      </>
    )
  }

  const clearDate = () => {
    const now = dayjs()
    setSelectedDate(now)
    setVisible(null)
    setIsSelectedMoment(false)
    onChange?.()
    onPanelVisibleChange?.(false)
  }

  const onResizeHandler = debounce(() => {
    setWrapperBounding()
  }, 500)

  useClickOther(toggleContainer, e => {
    if (visible && wrapperRef.current && !wrapperRef.current.contains(e.target as any)) {
      setVisible(false)
      onPanelVisibleChange?.(false)
    }
  })

  useEffect(() => {
    window.addEventListener('resize', onResizeHandler)

    return () => {
      window.removeEventListener('resize', onResizeHandler)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div
      style={style}
      className={cls('planet-date-picker', className, {
        [`planet-date-picker-position-${position}`]: position
      })}
      ref={toggleContainer}
    >
      <div
        className={cls('planet-date-picker-inner', {
          'planet-date-picker-active': visible
        })}
        ref={triggerWrapper}
      >
        <Input
          disabled={disabled}
          readOnly
          placeholder={placeholder}
          className={cls(`${'planet-date-picker'}-input`)}
          value={isSelectedMoment ? selectedTemplate.format(format) : ''}
          onClick={disabled ? undefined : onTogglePanel}
          size={size}
          suffix={suffix}
          allowClear={allowClear}
          onClear={clearDate}
        />
      </div>
      {createPortal(
        <div
          className={cls('planet-date-picker-content', popupContainerClassName, {
            'planet-date-picker-show': visible,
            'planet-date-picker-close': !visible,
            'planet-date-picker-hidden': visible === null
          })}
          ref={wrapperRef}
          style={{
            left: positionOptions.left,
            top: positionOptions.top
          }}
        >
          <Spin size='large' loading={loading} tip={tip}>
            <DatePickerHeader selectedDate={selectedDate} addMonth={addMonth} subtractMonth={subtractMonth} />

            <div
              className={cls('planet-date-picker-items', {
                'planet-date-picker-loading': loading
              })}
            >
              {renderDates()}
            </div>
            {extraFooter && <div className={`${'planet-date-picker'}-footer-extra`}>{extraFooter}</div>}
            <DatePickerFooter
              showToday={showToday}
              allowClear={allowClear}
              extraFooter={extraFooter}
              onSelectToday={onSelectToday}
              onClearDate={clearDate}
            />
          </Spin>
        </div>,
        getPopupContainer()
      )}
    </div>
  )
}

export default React.memo(DatePicker)
