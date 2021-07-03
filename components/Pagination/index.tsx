import React, { useState, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import Select from '../Select'
import Option from '../Select/Option'
import Button from '../Button'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icon'
import NumberInput from '../NumberInput'
import isNotEmpty from '../utils/isNotEmpty'
import isEmpty from '../utils/isEmpty'

export type PaginationSize = 'small' | 'default' | 'large'

export type PaginationProps = {
  page?: number
  pageSize?: number
  total?: number
  separator?: string
  locale?: {
    prevText?: React.ReactNode
    nextText?: React.ReactNode
  }
  size?: PaginationSize
  simple?: boolean
  className?: string
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  // 页码或 pageSize 改变的回调
  onChange?: (page: number, pageSize: number) => void
  onPageSizeChange?: (page: number, pageSize: number) => void
  showTotal?: (total: number) => React.ReactNode
}

const Pagination: React.FC<PaginationProps> = props => {
  const {
    page: propPage,
    pageSize: propPageSize,
    total = 1,
    separator = '/',
    simple,
    className,
    size = 'default',
    showSizeChanger,
    showQuickJumper,
    pageSizeOptions = [10, 20, 30, 40],
    locale = {
      prevText: <ArrowLeftIcon />,
      nextText: <ArrowRightIcon />
    },
    onChange,
    onPageSizeChange,
    showTotal
  } = props

  const defaultPage = 1,
    defaultPageSize = 10,
    baseShowLabel = ' 条 / 页'

  const [page, setPage] = useState<number>(propPage || defaultPage)
  const [pageSize, setPageSize] = useState<number>(propPageSize || defaultPageSize)
  const [quickJumperValue, setQuickJumperValue] = useState<string | number>('')

  useEffect(() => {
    if (isNotEmpty(propPage)) {
      setPage(propPage as number)
    }
    if (isNotEmpty(propPageSize)) {
      setPageSize(propPageSize as number)
    }
  }, [propPage, propPageSize])

  const pageCount = useMemo(() => {
    return Math.ceil(total / pageSize)
  }, [total, pageSize])

  const getCurrentPage = useMemo(() => {
    return Math.min(page, pageCount)
  }, [page, pageCount])

  const handleSetPage = (page: number) => {
    // 是否受控
    isEmpty(propPage) && setPage(page)
  }

  const onSimpleChange = (type: 'prev' | 'next') => () => {
    const newPage = type === 'prev' ? page - 1 : page + 1
    isEmpty(propPage) && setPage(newPage)
    onChange && onChange(newPage, pageSize)
  }

  const handleChange = (page: number) => () => {
    handleSetPage(page)
    onChange && onChange(page, pageSize)
  }

  const handlePageSizeChange = (pageSize: number) => {
    if (isEmpty(propPageSize)) setPageSize(pageSize)
    onChange && onChange(page, pageSize)
    onPageSizeChange && onPageSizeChange(page, pageSize)
  }

  const onQuickJumperKeyUp = (e: any) => {
    const inputPage = Number(e.target.value)
    const current = Math.min(inputPage, pageCount)

    if (e.keyCode === 13) {
      handleSetPage(page)
      setQuickJumperValue('')

      if (inputPage <= pageCount && inputPage !== page) {
        onChange && onChange(current, pageSize)
      }
    }
  }

  const onQuickJumperChange = (value: number) => {
    setQuickJumperValue(value)
  }

  const isDisabledPrev = simple ? page <= defaultPage : getCurrentPage <= defaultPage
  const isDisabledNext = simple ? page >= total : getCurrentPage >= pageCount

  // 简洁模式
  if (simple) {
    return (
      <div className={classnames('planet-pagination planet-pagination-simple', className)}>
        <Button
          type={isDisabledPrev ? 'default' : 'primary'}
          disabled={isDisabledPrev}
          onClick={onSimpleChange('prev')}
          size='small'
        >
          {locale.prevText}
        </Button>
        <span className='planet-pagination-simple-pages'>
          <span className={`planet-pagination-simple-page-index`}>{page}</span>
          <span className={`planet-pagination-simple-page-separator`}>{separator}</span>
          <span>{total}</span>
        </span>
        <Button
          type={isDisabledNext ? 'default' : 'primary'}
          disabled={isDisabledNext}
          size='small'
          onClick={onSimpleChange('next')}
        >
          {locale.nextText}
        </Button>
      </div>
    )
  }

  return (
    <ul
      className={classnames('planet-pagination', className, {
        [`planet-pagination-${size}`]: size
      })}
    >
      <li className='planet-pagination-show-total'>{showTotal && showTotal(total)}</li>
      <li
        className={classnames('planet-pagination-item', 'planet-pagination-prev', {
          [`planet-pagination-item-${size}`]: size !== 'default',
          'planet-pagination-item-disabled': isDisabledPrev
        })}
        onClick={!isDisabledPrev ? onSimpleChange('prev') : undefined}
      >
        {locale.prevText}
      </li>
      {new Array(pageCount).fill(0).map((_, index) => {
        const page = index + 1
        return (
          <li
            className={classnames('planet-pagination-item', {
              'planet-pagination-item-selected': page === getCurrentPage,
              [`planet-pagination-item-${size}`]: size !== 'default'
            })}
            key={index}
            onClick={handleChange(page)}
          >
            {page}
          </li>
        )
      })}
      <li
        className={classnames('planet-pagination-item planet-pagination-next', {
          [`planet-pagination-item-${size}`]: size !== 'default',
          'planet-pagination-item-disabled': isDisabledNext
        })}
        onClick={!isDisabledNext ? onSimpleChange('next') : undefined}
      >
        {locale.nextText}
      </li>

      {showSizeChanger && (
        <Select
          className='planet-pagination-size-changer'
          popupContainerClassName={classnames(
            'planet-pagination-size-changer-container',
            `planet-pagination-size-changer-container-${size}`
          )}
          size={size}
          value={pageSize}
          extraLabelValue={baseShowLabel}
          onChange={handlePageSizeChange}
        >
          {pageSizeOptions.map(pageSize => (
            <Option value={pageSize} key={pageSize}>
              {pageSize}
              {baseShowLabel}
            </Option>
          ))}
        </Select>
      )}

      {showQuickJumper && (
        <>
          <span>跳至</span>
          <NumberInput
            className={`planet-pagination-quick-jumper`}
            onChange={onQuickJumperChange}
            value={quickJumperValue}
            min={1}
            size={size}
            onKeyUp={onQuickJumperKeyUp}
          />
          <span>页</span>
        </>
      )}
    </ul>
  )
}

export default React.memo(Pagination)
