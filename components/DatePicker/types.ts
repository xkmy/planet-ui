import { Dayjs } from 'dayjs'

export type DatePickerPosition = 'top' | 'bottom'

export type DatePickerSize = 'default' | 'small' | 'large'

export type DatePickerProps = {
  className?: string
  value?: Dayjs
  defaultValue?: Dayjs
  format?: string
  placeholder?: string
  loading?: boolean
  showToday?: boolean
  allowClear?: boolean
  tip?: string
  showDayInPrevMonth?: boolean
  showDayInNextMonth?: boolean
  position?: DatePickerPosition
  suffix?: React.ReactNode
  size?: DatePickerSize
  disabled?: boolean
  popupContainerClassName?: string
  extraFooter?: React.ReactNode
  style?: React.CSSProperties
  getPopupContainer?: () => Element
  onPanelVisibleChange?: (visible: boolean) => void
  onChange?: (date?: Dayjs, dateFormat?: string) => void
  disabledDate?: (val: Dayjs) => boolean
}
