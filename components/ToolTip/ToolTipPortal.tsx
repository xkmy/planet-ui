import React, { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TooltipPortal = ({
  children,
  getPopupContainer,
  onChange
}: {
  children: React.ReactNode
  getPopupContainer: () => HTMLElement
  onChange: () => void
}) => {
  const elRef = useRef(document.createElement('div'))

  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elRef.current

    containerRef.current = getPopupContainer()
    containerRef.current.appendChild(element)

    if (onChange) onChange()

    return () => {
      containerRef.current && containerRef.current.removeChild(element)
    }
    // eslint-disable-next-line
  }, [])

  return createPortal(children, elRef.current)
}

export default TooltipPortal
