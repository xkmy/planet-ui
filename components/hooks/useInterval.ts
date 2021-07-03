import { useEffect, useRef } from 'react'

const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallback = useRef<Function>(() => {
    // 存储一个函数
  })

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay) {
      const interval = setInterval(() => savedCallback.current(), delay || 0)
      return () => {
        clearInterval(interval)
      }
    }

    return undefined
  }, [delay])
}

/**
 * use:
 *  const [running,setRunning] = useState(true)
 *  useInterval(
 *    () => {
 *     console.log(1 + 1)
 *   },
 *    running ? 1000 : null
 *  )
 *  <Button onClick={() => toggle()}>{running?'暂停':'开始'}</Button>
 */
export default useInterval
