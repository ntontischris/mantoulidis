'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">Κάτι πήγε στραβά</h2>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message ?? 'Άγνωστο σφάλμα'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary-600"
            >
              Δοκιμάστε ξανά
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
