import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import cls from 'classnames'
import { CloseIcon } from '../Icon'
import useBodyScroll from '../hooks/useBodyScroll'
import { Placements } from 'types/types'

export type Props = {
  title?: React.ReactNode
  content?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  confirmLoading?: boolean
  visible?: boolean
  closable?: boolean
  maskClosable?: boolean
  showMask?: boolean
  zIndex?: number
  width?: number | string
  height?: number | string
  placement?: Placements
  wrapperClassName?: string
  escClose?: boolean
  footer?: React.ReactNode
  getPopupContainer?: () => Element
  onClose?: () => void
}

const Drawer: React.FC<Props> = React.memo(
  ({
    title,
    visible: propVisible,
    className,
    wrapperClassName,
    style,
    maskClosable = true,
    closable = true,
    showMask = true,
    width = 300,
    height = 300,
    zIndex = 999,
    placement = 'right',
    escClose = true,
    footer,
    children,
    onClose,
    getPopupContainer = () => document.body
  }) => {
    const [visible, setVisible] = useState<boolean | null>(null)
    const [inited, setInited] = useState(false)

    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const [disableScroll, enableScroll] = useBodyScroll()

    useEffect(() => {
      if (propVisible !== undefined) {
        setVisible(propVisible)
      }
      if (propVisible) {
        setInited(true)
        disableScroll()
        wrapperRef.current && wrapperRef.current.focus()
      } else {
        enableScroll()
      }
    }, [propVisible, disableScroll, enableScroll])

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const ESC_KEY_CODE = 27

      if (!escClose) {
        return
      }
      if (e.keyCode === ESC_KEY_CODE) {
        e.stopPropagation()
        onClose?.()
      }
    }

    const handleClose = () => {
      if (visible !== undefined) {
        onClose?.()
      } else {
        setVisible(false)
      }
    }

    return createPortal(
      <div>
        {showMask && (
          <div
            className={cls('planet-drawer-mask', {
              'planet-drawer-mask-show': visible,
              /* 首次渲染时不显示动画 */
              'planet-drawer-mask-hide': inited && !visible
            })}
            onClick={maskClosable ? handleClose : undefined}
          />
        )}
        <div
          tabIndex={-1}
          className={cls('planet-drawer-wrap', wrapperClassName, {
            'planet-drawer-wrap-visible': visible
          })}
          onKeyDown={onKeyDown}
          ref={wrapperRef}
        >
          <div
            className={cls(
              'planet-drawer',
              className,
              {
                'planet-drawer-open': visible,
                'planet-drawer-close': !visible,
                'planet-drawer-no-title': !title
              },
              `${'planet-drawer'}-${placement}`
            )}
            style={{
              ...style,
              width,
              height: placement === 'bottom' || placement === 'top' ? height : '100%',
              zIndex
            }}
          >
            <div className='planet-drawer-header'>
              <h2 className='planet-drawer-title'>{title}</h2>
              {closable && <CloseIcon className='planet-drawer-close' onClick={handleClose} />}
            </div>
            <div className='planet-drawer-content'>{children}</div>
            {footer && <div className='planet-drawer-footer'>{footer}</div>}
          </div>
        </div>
      </div>,
      getPopupContainer()
    )
  }
)

export default Drawer
