import { TrendingUp, TrendingDown, Minus, Hash } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { HashtagTrend } from '@/types'

interface HashtagPanelProps {
  hashtags: HashtagTrend[]
  className?: string
}

function TrendIcon({ trend }: { trend: HashtagTrend['trend'] }) {
  switch (trend) {
    case 'rising':
      return <TrendingUp className="h-4 w-4 text-success" />
    case 'falling':
      return <TrendingDown className="h-4 w-4 text-error" />
    case 'stable':
    default:
      return <Minus className="h-4 w-4 text-base-content/60" />
  }
}

function SentimentBadge({ label }: { label: HashtagTrend['sentimentLabel'] }) {
  const badgeClass = {
    Positive: 'badge-success',
    Negative: 'badge-error',
    Neutral: 'badge-warning',
  }[label]

  return (
    <span className={cn('badge badge-sm', badgeClass)}>
      {label}
    </span>
  )
}

export function HashtagPanel({ hashtags, className }: HashtagPanelProps) {
  if (!hashtags || hashtags.length === 0) {
    return (
      <div className={cn('card bg-base-200', className)}>
        <div className="card-body items-center justify-center py-12">
          <Hash className="h-8 w-8 text-base-content/60" />
          <p className="text-base-content/60 text-sm">
            No trending hashtags available
          </p>
        </div>
      </div>
    )
  }

  const sortedHashtags = [...hashtags].sort((a, b) => b.mentions - a.mentions)

  return (
    <div className={cn('card bg-base-200', className)}>
      <div className="card-body">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Trending Hashtags
        </h3>

        <div className="overflow-y-auto max-h-96 mt-3">
          <div className="space-y-2">
            {sortedHashtags.map((tag, index) => (
              <motion.div
                key={tag.hashtag}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-base-300/30 hover:bg-base-300/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base-content/60 text-xs font-mono w-6 text-right">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-base-content">
                      {tag.hashtag}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {tag.mentions.toLocaleString()} mentions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <SentimentBadge label={tag.sentimentLabel} />

                  <div className="flex items-center gap-1">
                    <TrendIcon trend={tag.trend} />
                    <span
                      className={cn(
                        'text-xs font-mono',
                        tag.changePercent > 0 ? 'text-success' : tag.changePercent < 0 ? 'text-error' : 'text-base-content/60'
                      )}
                    >
                      {tag.changePercent > 0 ? '+' : ''}
                      {tag.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
