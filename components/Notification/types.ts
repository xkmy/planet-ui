import { Ref } from 'react'

export type NotificationProps = {
  key?: string
  children?: React.ReactNode
  className?: string
  darkTheme?: boolean
  // 秒级
  duration?: number
  offset?: number
  position?: NotificationPosition
  closable?: boolean
  type?: NotificationType
  style?: React.CSSProperties
  title?: React.ReactNode
  content?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClose?: (notice: NotificationProps) => void
}

export type Props = {
  ref?: Ref<NotificationOption>
  position: NotificationPosition
  timeOut?: number
}

export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type NotificationType = 'open' | 'info' | 'success' | 'error' | 'warning' | 'loading'

export type NotificationOption = {
  removeNotice: (key: string) => void
  addNotice: (notice: NotificationProps) => () => void
}
