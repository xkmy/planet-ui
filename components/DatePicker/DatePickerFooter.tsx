import React from 'react'
import classnames from 'classnames'

type Props = {
  showToday?: boolean
  allowClear?: boolean
  extraFooter?: React.ReactNode
  onSelectToday: () => void
  onClearDate?: () => void
}

const Footer: React.FC<Props> = ({ showToday, allowClear, extraFooter, onSelectToday, onClearDate }) => {
  return (
    <div>
      {showToday || allowClear ? (
        <div
          className={classnames(`${'planet-date-picker'}-footer`, {
            [`${'planet-date-picker'}-has-extra-footer`]: extraFooter,
            [`${'planet-date-picker'}-has-border`]: extraFooter || showToday || allowClear
          })}
        >
          {showToday && (
            <div className='planet-date-picker-footer-today' onClick={onSelectToday}>
              今天
            </div>
          )}
          {allowClear && (
            <div className={classnames(`${'planet-date-picker'}-footer-clear`)} onClick={onClearDate}>
              清除
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
export default React.memo(Footer)
