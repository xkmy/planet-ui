function filterRegex(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
}

type Returns = {
  chunk: string
  highlighted: boolean
}

/**
 * 生成高亮元素
 * @param text 原本文
 * @param keywords 高亮关键词
 * @returns
 */
export const createHighlighters = (text: string, keywords: string | string[]): Returns[] => {
  if (!keywords) {
    return [{ chunk: text, highlighted: false }]
  }

  const highlight = Array.isArray(keywords) ? keywords.map(filterRegex) : filterRegex(keywords)

  const shouldHighlight = Array.isArray(highlight)
    ? highlight.filter(part => part.trim().length).length
    : highlight.trim() !== ''

  if (!shouldHighlight) {
    return [{ chunk: text, highlighted: false }]
  }

  const matcher =
    typeof highlight === 'string'
      ? highlight.trim()
      : highlight
          .filter(part => part.trim().length !== 0)
          .map(part => part.trim())
          .join('|')

  const regex = new RegExp(`(${matcher})`, 'gi')
  const chunks = text
    .split(regex)
    .map(v => ({ chunk: v, highlighted: regex.test(v) }))
    .filter(({ chunk }) => chunk)

  return chunks
}
