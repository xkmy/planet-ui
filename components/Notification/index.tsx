import ReactDOM from 'react-dom'
import React from 'react'
import Notification from './Notification'
import { NotificationPosition, NotificationProps } from './types'

// 创建一份 notification 元素
const createNotification = (position: NotificationPosition) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ref: any = React.createRef()
  ReactDOM.render(<Notification position={position} ref={ref} />, div)
  return {
    addNotice(notice: NotificationProps) {
      return ref.current.addNotice(notice)
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

const notificationMap: {
  [props: string]: any
} = {}

// 创建不同方位的notice
const notice = (props: NotificationProps) => {
  const { position = 'top-right' } = props
  if (!notificationMap[position]) notificationMap[position] = createNotification(position)
  return notificationMap[position].addNotice(props)
}

export default {
  info(props: NotificationProps) {
    return notice({ ...props, type: 'info' })
  },
  success(props: NotificationProps) {
    return notice({ ...props, type: 'success' })
  },
  warning(props: NotificationProps) {
    return notice({ ...props, type: 'warning' })
  },
  error(props: NotificationProps) {
    return notice({ ...props, type: 'error' })
  },
  loading(props: NotificationProps) {
    return notice({ ...props, type: 'loading' })
  }
}
