import React, { Ref } from 'react'
import ReactDOM from 'react-dom'
import Message, { MessageOption } from './Message'
import { MessageItemTypes } from './MessageItem'

const createMessage = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ref: Ref<MessageOption> = React.createRef()
  ReactDOM.render(<Message ref={ref} />, div)

  return {
    addMessage(message: MessageItemTypes) {
      return ref.current?.addMessage(message)
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

let messageDom: any

const message = (props: MessageItemTypes) => {
  if (!messageDom) messageDom = createMessage()

  return messageDom.addMessage(props)
}

export default {
  info(props: MessageItemTypes) {
    return message({ ...props, type: 'info' })
  },
  success(props: MessageItemTypes) {
    return message({ ...props, type: 'success' })
  },
  warning(props: MessageItemTypes) {
    return message({ ...props, type: 'warning' })
  },
  error(props: MessageItemTypes) {
    return message({ ...props, type: 'error' })
  },
  loading(props: MessageItemTypes) {
    return message({ ...props, type: 'loading' })
  }
}
