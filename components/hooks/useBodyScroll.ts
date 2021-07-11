import { useCallback } from 'react'

const useBodyScroll = () => {
  const disableScroll = useCallback(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '15px'
  }, [])

  const enableScroll = useCallback(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = '0'
  }, [])

  return [disableScroll, enableScroll]
}

export default useBodyScroll
