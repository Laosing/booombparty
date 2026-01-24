import { Component, type ReactNode, type ErrorInfo } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  name?: string
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

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `ErrorBoundary [${this.props.name || "Unknown"}] caught error:`,
      error,
      info,
    )
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="p-4 border-2 border-error bg-error/10 rounded-xl m-4 text-center">
          <h3 className="text-lg font-bold text-error mb-2">
            Failed to load {this.props.name || "component"}
          </h3>
          <p className="text-sm opacity-70 mb-4">
            {this.state.error?.message || "Unknown error occurred"}
          </p>
          <div className="text-xs font-mono text-left bg-base-300 p-2 rounded mb-4 overflow-x-auto max-h-40">
            {this.state.error?.stack}
          </div>
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
