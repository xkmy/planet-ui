import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import { UpIcon } from '../Icon'

type Props = {
  className?: string
  showHeight?: number
  children?: React.ReactNode
  onClick?: () => void
}

const BackToTop: React.FC<Props> = ({ className, showHeight = 400, children, onClick }) => {
  const [visible, setVisible] = useState(false)
  const [animateLock, setAnimateLock] = useState(false)

  const scrollToTop = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 0) {
      window.requestAnimationFrame(scrollToTop)
      document.body.scrollTop = scrollTop - scrollTop / 8
      document.documentElement.scrollTop = scrollTop - scrollTop / 8
    }
  }

  const scroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const show = scrollTop >= showHeight
    if (!show && animateLock) {
      setVisible(false)
    } else {
      setVisible(true)
      setAnimateLock(true)
    }
  }, [animateLock, showHeight])

  useEffect(() => {
    window.addEventListener('scroll', scroll)

    return () => {
      window.removeEventListener('scroll', scroll)
    }
  }, [scroll])

  const handleClick = () => {
    onClick && onClick()
    scrollToTop()
  }

  return (
    <div
      className={classnames('planet-back-top', className, {
        'planet-back-top-open': visible,
        'planet-back-top-close': !visible
      })}
    >
      <div className='planet-back-top-inner' onClick={handleClick}>
        {children || (
          <div className='planet-back-top-inner-icon'>
            <UpIcon />
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(BackToTop)
