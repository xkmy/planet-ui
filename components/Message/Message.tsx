import React, { useState, forwardRef, useImperativeHandle, Ref } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import MessageItem, { MessageItemTypes } from './MessageItem'

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export type MessageOption = {
  addMessage: (notice: MessageItemTypes) => void
  removeMessage: (key: string) => void
}

const DEFAULT_CLOSE_TIME = 300

const Message = forwardRef((props: { ref?: Ref<MessageOption> }, ref: Ref<MessageOption>) => {
  const [messageList, setMessageList] = useState<MessageItemTypes[]>([])

  const getNoticeKey = () => {
    return `message-${new Date().getTime()}-${messageList.length}`
  }

  const removeMessage = (key?: string, autoRunClose = true) => {
    setMessageList(msgs =>
      msgs.filter(msg => {
        if (msg.key === key) {
          if (msg.onClose && autoRunClose) setTimeout(msg.onClose, DEFAULT_CLOSE_TIME)
          return false
        }
        return true
      })
    )
  }

  const addMessage = (message: MessageItemTypes) => {
    const key = getNoticeKey()
    if (messageList.every(item => item.key !== message.key)) {
      setMessageList([...messageList, { ...message, key }])

      if (message.duration !== 0) {
        setTimeout(() => {
          removeMessage(key as string)
        }, (message.duration || 3) * 1000)
      }
    }
  }

  useImperativeHandle(ref, () => {
    return {
      addMessage,
      removeMessage
    }
  })

  return (
    <TransitionGroup>
      {messageList.map(message => (
        <CSSTransition key={message.key} classNames='planet-message' timeout={DEFAULT_CLOSE_TIME}>
          <MessageItem {...message} key={message.key} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  )
})

export default React.memo(Message)
