import { Component, type ErrorInfo, type ReactNode } from 'react'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  error: Error | null
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AIGC Web render error', error, errorInfo)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="app-fatal-state">
        <strong>页面暂时无法加载</strong>
        <span>请刷新页面重试。如果问题持续出现，请保留当前时间并联系支持人员。</span>
        {import.meta.env.DEV && <code>{this.state.error.message}</code>}
        <button type="button" onClick={() => window.location.reload()}>
          刷新页面
        </button>
      </main>
    )
  }
}
