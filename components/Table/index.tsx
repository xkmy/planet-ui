import React, { useState, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import Pagination, { PaginationProps } from '../Pagination'
import Spin from '../Spin'
import Empty from '../Empty'
import Checkbox from '../Checkbox'
import { useCallback } from 'react'
import isEmpty from '../utils/isEmpty'
import isNotEmpty from '../utils/isNotEmpty'
import { useRef } from 'react'

export type Column = {
  title?: React.ReactNode
  width?: number
  render?: Function
  key?: string
  dataIndex?: string
  align?: 'left' | 'center' | 'right'
}

export type RowSelection = {
  getCheckboxProps?: Function
  rowClickSelect?: boolean // 是否允许点击行选中
  onClick?: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void
  onChange: (selectedRowKeys: string | number[], selectedRows: any[]) => void
}

type Props = {
  columns?: Column[]
  dataSource?: any[]
  pagination?: PaginationProps
  className?: string
  loading?: boolean
  loadingTip?: string
  bordered?: boolean
  showHeader?: boolean
  rowSelection?: RowSelection
  stripe?: boolean
}

const defaultPageConfig = {
  page: 1,
  pageSize: 10
}

const Table: React.FC<Props> = props => {
  const {
    dataSource = [],
    columns,
    className,
    pagination = {},
    rowSelection,
    stripe, // 斑马纹
    bordered,
    loading = false,
    loadingTip = '',
    showHeader = true // 是否显示表头
  } = props

  const { page: propPage, pageSize: propPageSize, total = 0 } = pagination

  const [page, setPage] = useState(propPage || defaultPageConfig.page)
  const [pageSize, setPageSize] = useState(propPageSize || defaultPageConfig.pageSize)
  const [, refresh] = useState({})

  const selectedRowsMap = useRef<{
    [props: string]: any
  }>({})

  useEffect(() => {
    if (isNotEmpty(propPage)) {
      setPage(propPage as number)
    }
    if (isNotEmpty(propPageSize)) {
      setPageSize(propPageSize as number)
    }
  }, [propPage, propPageSize])

  let rowsMap: { [props: string]: boolean } = {}

  // 当前展示的数据
  const dataList = useMemo(() => {
    return dataSource.slice((page - 1) * pageSize, page * pageSize)
  }, [page, pageSize, dataSource])

  const getCurrentSelectRows = (): any[] => {
    return selectedRowsMap.current[page] || []
  }

  const isIndeterminate = () => {
    const disabledRows = Object.values(rowsMap).filter(Boolean)

    return (
      getCurrentSelectRows().length >= 1 &&
      getCurrentSelectRows().length < dataList.length - disabledRows.length
    )
  }

  const isSelectAll = () => {
    return getCurrentSelectRows().length === dataList.length
  }

  const onSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    if (checked) {
      // 过滤掉 disabled 项
      const rows = dataList.filter((_, i) => !rowsMap[i])
      selectedRowsMap.current[page] = rows
    } else {
      selectedRowsMap.current[page] = []
    }

    refresh({})
  }

  function isEqual<T>(obj1: T, obj2: T) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  const tableHeader = () => {
    return (
      <thead className='planet-table-thead'>
        <tr>
          {rowSelection && (
            <th key={`thead-checkbox`}>
              <Checkbox
                onChange={onSelectAllChange}
                checked={isSelectAll()}
                indeterminate={isIndeterminate()}
              />
            </th>
          )}
          {columns?.map(({ align, width, title }, index) => {
            return (
              <th style={{ textAlign: align, width }} key={`thead-${index}`}>
                {title}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  const onRowCheckboxChange = (row: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    if (checked) {
      selectedRowsMap.current[page] = [...getCurrentSelectRows(), row]
    } else {
      selectedRowsMap.current[page] = getCurrentSelectRows().filter(
        v => JSON.stringify(v) !== JSON.stringify(row)
      )
    }

    if (rowSelection?.onChange) {
      const selectedRowKeys = getCurrentSelectRows().map(({ key }) => key)
      rowSelection.onChange(selectedRowKeys, getCurrentSelectRows())
    }
    refresh({})
  }

  const rowClick = (row: any, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    rowSelection?.onClick && rowSelection.onClick(e)

    if (rowSelection?.rowClickSelect) {
      if (getCurrentSelectRows().find(v => isEqual(v, row))) {
        selectedRowsMap.current[page] = getCurrentSelectRows().filter((v: any) => !isEqual(v, row))
      } else {
        selectedRowsMap.current[page] = [...getCurrentSelectRows(), row]
      }

      if (rowSelection?.onChange) {
        const selectedRowKeys = getCurrentSelectRows().map(({ key }) => key)
        rowSelection.onChange(selectedRowKeys, getCurrentSelectRows())
      }
      refresh({})
    }
  }

  const tableBody = () => {
    rowsMap = {}

    if (!columns || !dataSource) return

    return (
      <tbody className='planet-table-tbody'>
        {dataList.map((item, index) => {
          const { key: rowKey = `tbody-${index}` } = columns[index] || {}
          const isChecked = !!getCurrentSelectRows().find(row => JSON.stringify(row) === JSON.stringify(item))
          const checkboxProps = (rowSelection?.getCheckboxProps && rowSelection.getCheckboxProps(item)) || {}
          rowsMap[index] = checkboxProps.disabled || false
          return (
            <tr
              onClick={e => rowClick(item, e)}
              key={rowKey}
              className={classnames({
                [`planet-table-stripe`]: stripe && (index + 1) % 2 === 0
              })}
            >
              {rowSelection && (
                <td key='tbody-checkbox'>
                  <Checkbox
                    checked={!checkboxProps.disabled && isChecked}
                    onChange={onRowCheckboxChange(item)}
                    {...checkboxProps}
                  />
                </td>
              )}
              {columns.map(column => {
                const { width, align, dataIndex, render } = column
                const value = dataIndex && item[dataIndex]
                return (
                  <td style={{ width, textAlign: align }} key={`td-${dataIndex}`}>
                    {(render && render(value, item, index)) || value}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  const onPageChange = useCallback(
    (page: number, pageSize: number) => {
      // 是否受控
      isEmpty(propPage) && setPage(page)
      isEmpty(propPageSize) && setPageSize(pageSize)
      pagination.onChange && pagination.onChange(page, pageSize)
    },
    [propPage, propPageSize, pagination]
  )

  const hasData = useMemo(() => dataSource.length >= 1, [dataSource])

  return (
    <div
      className={classnames('planet-table', className, {
        'planet-table-bordered': bordered
      })}
    >
      <Spin loading={loading} tip={loadingTip} size='large'>
        <table className={`${'planet-table'}-origin-table`}>
          {showHeader && tableHeader()}
          {hasData && tableBody()}
        </table>
        {!hasData && <Empty />}
        {pagination && hasData && (
          <div className={classnames(`${'planet-table'}-pagination`)}>
            <Pagination
              {...pagination}
              page={page}
              pageSize={pageSize}
              total={total || dataSource.length || 0}
              onChange={onPageChange}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}

export default React.memo(Table)
