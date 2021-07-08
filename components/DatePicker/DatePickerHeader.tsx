import React from 'react'
import { Dayjs } from 'dayjs'
import classnames from 'classnames'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icon'

const DatePickerHeader: React.FC<{
  selectedDate: Dayjs
  addMonth: () => void
  subtractMonth: () => void
}> = ({ selectedDate, addMonth, subtractMonth }) => {
  return (
    <div>
      <div className='planet-date-picker-header'>
        <span className='planet-date-picker-date'>
          {selectedDate.year()}年{selectedDate.month() + 1}月
        </span>
        <span className={classnames(`${'planet-date-picker'}-switch`)}>
          <span className={classnames(`${'planet-date-picker'}-switch-group`)} onClick={subtractMonth}>
            <ArrowLeftIcon />
          </span>
          <span className={classnames(`${'planet-date-picker'}-switch-group`)} onClick={addMonth}>
            <ArrowRightIcon />
          </span>
        </span>
      </div>
    </div>
  )
}
export default React.memo(DatePickerHeader)
