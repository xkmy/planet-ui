import { useState, useCallback, useRef, useEffect } from 'react'
import { Placements } from '../types/types'
import debounce from '../utils/debounce'

type InitState = {
  position: Placements
}

const useToolTip = ({ position }: InitState) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const triggerWrapper = useRef<HTMLDivElement | null>(null)

  const [positionInfo, setPositionInfo] = useState({
    left: 0,
    top: 0
  })

  const getWrapperBounding = useCallback(() => {
    if (!triggerWrapper.current || !wrapperRef.current) return
    const { width, height, top, left } = triggerWrapper.current.getBoundingClientRect()
    const { height: wrapperHeight, width: wrapperWidth } = wrapperRef.current.getBoundingClientRect()

    const { scrollX, scrollY } = window

    const positions = {
      top: {
        top: top + scrollY - wrapperHeight + 8,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      bottom: {
        top: top + height + scrollY,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      left: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX - wrapperWidth
      },
      right: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX + width
      }
    }
    return positions[position]
  }, [position])

  const setWrapperBounding = useCallback(() => {
    const positions = getWrapperBounding()
    if (positions) {
      const { left, top } = positions
      setPositionInfo(positionInfo => ({ ...positionInfo, left, top }))
    }
  }, [getWrapperBounding])

  useEffect(() => {
    const onResizeHandler = debounce(() => {
      setWrapperBounding()
    }, 500)

    window.addEventListener('resize', onResizeHandler)

    return () => {
      window.removeEventListener('resize', onResizeHandler)
    }
  }, [setWrapperBounding])

  return { wrapperRef, triggerWrapper, positionInfo, getWrapperBounding, setWrapperBounding }
}

export default useToolTip
