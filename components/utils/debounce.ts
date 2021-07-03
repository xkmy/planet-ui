export type Procedure = (...args: any[]) => any

export type Options<TT> = {
  isImmediate?: boolean
  maxWait?: number
  callback?: (data: TT) => void
}

const debounce = <F extends Procedure>(func: F, wait = 100, options: Options<ReturnType<F>> = {}) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const isImmediate = options.isImmediate ?? false
  const callback = options.callback ?? false
  const maxWait = options.maxWait
  let lastInvokeTime = Date.now()

  const nextInvokeTimeout = () => {
    if (maxWait !== undefined) {
      const timeSinceLastInvocation = Date.now() - lastInvokeTime

      if (timeSinceLastInvocation + wait >= maxWait) {
        return maxWait - timeSinceLastInvocation
      }
    }

    return wait
  }

  const debounced = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    // eslint-disable-next-line
    const context = this
    return new Promise<ReturnType<F>>(resolve => {
      const invokeFunction = function () {
        timeoutId = undefined
        lastInvokeTime = Date.now()
        if (!isImmediate) {
          const result = func.apply(context, args)
          callback && callback(result)
        }
      }

      const shouldCallNow = isImmediate && timeoutId === undefined

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeTimeout())

      if (shouldCallNow) {
        const result = func.apply(context, args)
        callback && callback(result)
        return resolve(result)
      }
    })
  }

  return debounced
}

export default debounce
