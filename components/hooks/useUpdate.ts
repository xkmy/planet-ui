import { useCallback, useState } from 'react'

const useUpdate = () => {
  const [, update] = useState({})

  const setUpdate = useCallback(() => update({}), [])

  return setUpdate
}

export default useUpdate
