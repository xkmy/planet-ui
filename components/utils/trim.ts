/**
 * 去除字符串首尾的指定字符, 默认为空格(whitespace)
 * @param origin 任意字符
 * @param character 需要去除的字符
 */
export default function trim(origin: string, character?: string): string {
  if (!origin) return ''

  let result = ''

  if (!character) {
    const reg = /(^\s+)|(\s+$)/g

    result = origin.replace(reg, '')
  } else {
    const reg = new RegExp(`(^${character}+)|(${character}+$)`, 'g')

    result = origin.replace(reg, '')
  }

  return result
}
