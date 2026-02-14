import { X, AlertTriangle, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Alert } from '@/types'

interface AlertBannerProps {
  alerts: Alert[]
  onDismiss: (id: string) => void
  onDismissAll?: () => void
  className?: string
}

function AlertIcon({ type }: { type: Alert['type'] }) {
  switch (type) {
    case 'downtrend':
      return <TrendingDown className="h-5 w-5 shrink-0" />
    case 'sentiment-drop':
      return <TrendingDown className="h-5 w-5 shrink-0" />
    case 'volatility':
      return <AlertTriangle className="h-5 w-5 shrink-0" />
    default:
      return <AlertTriangle className="h-5 w-5 shrink-0" />
  }
}

function severityClass(severity: Alert['severity']): string {
  switch (severity) {
    case 'high':
      return 'alert-error'
    case 'medium':
      return 'alert-warning'
    case 'low':
    default:
      return 'alert-info'
  }
}

function severityBadgeClass(severity: Alert['severity']): string {
  switch (severity) {
    case 'high':
      return 'badge-error'
    case 'medium':
      return 'badge-warning'
    case 'low':
    default:
      return 'badge-info'
  }
}

export function AlertBanner({
  alerts,
  onDismiss,
  onDismissAll,
  className,
}: AlertBannerProps) {
  const activeAlerts = alerts.filter((a) => !a.dismissed)

  if (activeAlerts.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      {/* Dismiss all button */}
      {activeAlerts.length > 1 && onDismissAll && (
        <div className="flex justify-end">
          <button
            className="btn btn-ghost btn-xs text-base-content/60"
            onClick={onDismissAll}
          >
            <X className="h-3 w-3" />
            Dismiss All ({activeAlerts.length})
          </button>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              role="alert"
              className={cn('alert', severityClass(alert.severity))}
            >
              <AlertIcon type={alert.type} />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{alert.symbol}</span>
                  <span
                    className={cn(
                      'badge badge-sm',
                      severityBadgeClass(alert.severity)
                    )}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => onDismiss(alert.id)}
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
