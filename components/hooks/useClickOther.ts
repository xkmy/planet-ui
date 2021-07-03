import { RefObject, useEffect, useRef } from 'react'
const on = (obj: any, ...args: any[]) => obj.addEventListener(...args)
const off = (obj: any, ...args: any[]) => obj.removeEventListener(...args)
const defaultEvents = ['mousedown', 'touchstart']

// 在目标元素之外单击时,将触发此hook
const useClickOther = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents
) => {
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    const handler = (event: any) => {
      const { current: el } = ref
      el && !el.contains(event.target) && savedCallback.current(event)
    }
    for (const eventName of events) {
      on(document, eventName, handler)
    }
    return () => {
      for (const eventName of events) {
        off(document, eventName, handler)
      }
    }
  }, [events, ref])
}

export default useClickOther
