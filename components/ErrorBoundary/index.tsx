import React from 'react'
import { FallbackElement, FallbackProps, FallbackRender } from './types'

type Props = {
  /**
   * 出错时渲染的元素,和 fallbackRender , FallbackComponent 三选一即可
   */
  fallback?: FallbackElement
  /**
   * 出错时渲染的组件
   */
  FallbackComponent?: React.ComponentType<FallbackProps>
  children?: React.ReactNode
  /**
   * 出错时的回调函数
   */
  fallbackRender?: typeof FallbackRender
  /**
   * 出错时的回调
   */
  onError?: (error: Error, info: string) => void
  /**
   * 重试时的回调
   */
  onReset?: () => void
}

type State = {
  error: Error | null
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }
  updatedWithError = false

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack)
    }
  }

  reset = () => {
    this.updatedWithError = false
    this.setState({ error: null })
  }

  resetErrorBoundary = () => {
    this.props.onReset?.()
    this.reset()
  }

  render() {
    const { fallback, FallbackComponent, fallbackRender } = this.props
    const { error } = this.state

    if (error !== null) {
      const fallbackProps: FallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      }

      if (React.isValidElement(fallback)) {
        return fallback
      }

      if (typeof fallbackRender === 'function') {
        return (fallbackRender as typeof FallbackRender)(fallbackProps)
      }

      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />
      }

      throw new Error('ErrorBoundary 组件需要传入 fallback, fallbackRender, FallbackComponent 其中一个')
    }

    return this.props.children
  }
}

function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Props
): React.ComponentType<P> {
  const Wrapped: React.ComponentType<P> = props => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  const name = Component.displayName || Component.name || 'Unknown'
  Wrapped.displayName = `withErrorBoundary(${name})`

  return Wrapped
}

export * from './types'

export { ErrorBoundary, withErrorBoundary }
