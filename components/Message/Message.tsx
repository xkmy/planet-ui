import React, { useState, forwardRef, useImperativeHandle, Ref } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import MessageItem, { MessageItemTypes } from './MessageItem'
import { TIME_OUT } from '../constants/constants'

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export type MessageOption = {
  addMessage: (notice: MessageItemTypes) => void
  removeMessage: (key: string) => void
}

const Message = forwardRef(
  (props: { ref?: Ref<MessageOption>; timeOut?: number }, ref: Ref<MessageOption>) => {
    const [messageList, setMessageList] = useState<MessageItemTypes[]>([])

    const getNoticeKey = () => {
      return `message-${new Date().getTime()}-${messageList.length}`
    }

    const removeMessage = (key?: string, autoRunClose = true) => {
      setMessageList(msgs =>
        msgs.filter(msg => {
          if (msg.key === key) {
            if (msg.onClose && autoRunClose) setTimeout(msg.onClose, props.timeOut || TIME_OUT)
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
          <CSSTransition key={message.key} classNames='planet-message' timeout={props.timeOut || TIME_OUT}>
            <MessageItem {...message} key={message.key} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }
)

export default React.memo(Message)
