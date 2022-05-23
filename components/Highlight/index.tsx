import React, { useMemo } from 'react'
import { createHighlighters } from './util'
import { trim } from '../utils'

type Color = 'white' | 'red' | 'blue' | 'green' | 'gray' | 'orange' | 'purple' | 'magenta' | 'lime'

export type HighlightProps = {
  /**
   * 要高亮的关键词
   */
  keywords: string | string[]

  /**
   * 高亮颜色
   */
  color?: Color

  className?: string | Record<string, string>

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

const Highlight: React.FC<HighlightProps> = ({
  keywords,
  children,
  color = 'red',
  backgroundColor,
  className,
  style
}) => {
  const highlighters = useMemo(() => createHighlighters(children, keywords), [children, keywords])

  const getClassnames = (v: string) => {
    let name = className || ''

    if (typeof className === 'object') name = className[v]

    return trim(
      `${backgroundColor ? `planet-highlight-bg-${backgroundColor}` : ''} ${
        color ? `planet-highlight-color-${color}` : ''
      } ${name}`
    )
  }

  return (
    <>
      {highlighters.map((v, i) =>
        v.highlighted ? (
          <span className={getClassnames(v.chunk)} key={i} style={style}>
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
