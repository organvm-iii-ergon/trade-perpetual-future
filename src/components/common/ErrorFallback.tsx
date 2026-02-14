import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div role="alert" className="alert alert-error max-w-lg">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Something went wrong</h3>
          <p className="text-sm mt-1">
            An unexpected error occurred. Please try again.
          </p>
          {message && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm opacity-80">
                Error details
              </summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap break-all bg-base-100/20 p-3 rounded-lg">
                {message}
              </pre>
            </details>
          )}
        </div>
        <button
          className="btn btn-sm"
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
