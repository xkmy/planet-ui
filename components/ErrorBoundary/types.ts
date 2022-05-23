import React from 'react'

export type FallbackElement = React.ReactElement<unknown, string | React.FC | typeof React.Component> | null

export interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export declare function FallbackRender(props: FallbackProps): FallbackElement
