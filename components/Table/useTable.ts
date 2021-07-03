import { useCallback, useEffect, useState } from 'react'

type InitState = {
  propPage?: number
}

const useTable = ({ propPage }: InitState) => {
  const [page, setPage] = useState(propPage || 1)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [baseSelectedRows, setBaseSelectedRows] = useState([])
  const [isSelectAll, setIsSelectAll] = useState(false)

  useEffect(() => {
    if (propPage !== null && propPage !== undefined) {
      setPage(propPage)
    }
  }, [propPage])

  return {
    page,
    selectedRows,
    baseSelectedRows,
    isSelectAll,
    setSelectedRows,
    setBaseSelectedRows,
    setIsSelectAll
  }
}

export default useTable
