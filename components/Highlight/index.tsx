import React, { useMemo } from 'react'
import { createHighlighters } from './util'
import { trim } from '../utils'

type Color = 'white' | 'red' | 'blue' | 'green' | 'gray' | 'orange' | 'purple' | 'magenta' | 'lime'

type Props = {
  /**
   * 要高亮的关键词
   */
  keywords: string | string[]

  /**
   * 高亮颜色
   */
  color?: Color

  className?: string

  /**
   * 自定义样式
   */
  style?: React.CSSProperties

  /**
   * 高亮背景色
   */
  backgroundColor?: Color

  /**
   * 渲染的原文本
   */
  children: string
}

const Highlight: React.FC<Props> = ({ keywords, children, color, backgroundColor, className, style }) => {
  const highlighters = useMemo(() => createHighlighters(children, keywords), [children, keywords])

  const getClassnames = () => {
    return trim(
      `${backgroundColor ? `planet-highlight-bg-${backgroundColor}` : ''} ${
        color ? `planet-highlight-color-${color}` : ''
      } ${className || ''}`
    )
  }

  return (
    <>
      {highlighters.map((v, i) =>
        v.highlighted ? (
          <span className={getClassnames()} key={i} style={style}>
            {v.chunk}
          </span>
        ) : (
          v.chunk
        )
      )}
    </>
  )
}

export { createHighlighters, Highlight }

export default React.memo(Highlight)
