import { Dispatch, useCallback, useRef } from 'react'
import useUpdate from './useUpdate'
import { IHookStateInitAction, IHookStateSetAction, resolveHookState } from './lib'

/**
 * 同步更新 state 的 hook
 * @param initialState
 * @returns
 */
export default function useSyncState<S>(
  initialState: IHookStateInitAction<S>
): [S, Dispatch<IHookStateSetAction<S>>] {
  const state = useRef(resolveHookState(initialState))
  const update = useUpdate()

  const setState = useCallback(
    (newState: IHookStateSetAction<S>) => {
      if (newState !== state.current) {
        state.current = resolveHookState(newState, state.current)
        update()
      }
    },
    [update]
  )

  return [state.current, setState]
}
