import React, { useRef, useEffect } from 'react'

type Props = { className?: string; data: string; interval?: number }

const TypeWrite = ({ data, interval = 200, className = '' }: Props) => {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ;(() => {
      let index = 0
      let timer: NodeJS.Timeout | null = null
      const writing = () => {
        if (index < data.length) {
          // 追加文字
          if (!contentRef.current) return
          contentRef.current.innerHTML += data[index++]
        } else {
          timer && clearInterval(timer)
        }
      }
      timer = setInterval(writing, interval)
    })()
  }, [data, interval])

  return <div ref={contentRef} className={`write-content ${className}`}></div>
}
export default React.memo(TypeWrite)
