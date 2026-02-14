import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Symbol } from '@/types'
import { getSentimentColor, getSentimentBgColor } from '@/lib/sentiment'

interface SymbolCardProps {
  symbol: Symbol
  onClick: () => void
  isSelected: boolean
}

export function SymbolCard({ symbol, onClick, isSelected }: SymbolCardProps) {
  const trendIcon = symbol.sentiment.trend === 'up'
    ? <TrendingUp size={16} />
    : symbol.sentiment.trend === 'down'
    ? <TrendingDown size={16} />
    : <Minus size={16} />

  return (
    <div
      className={`card bg-base-200 p-6 cursor-pointer transition-all hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-accent animate-glow-pulse' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono font-bold text-xl">{symbol.ticker}</h3>
          <p className="text-sm text-base-content/60">{symbol.name}</p>
        </div>
        <span className={`badge ${getSentimentBgColor(symbol.sentiment.score)}`}>
          <span className={getSentimentColor(symbol.sentiment.score)}>
            {symbol.sentiment.label}
          </span>
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-base-content/60">Price</span>
          <span className="font-mono font-bold text-2xl">
            ${symbol.currentPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/60">Sentiment Score</span>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-semibold ${getSentimentColor(symbol.sentiment.score)}`}>
              {symbol.sentiment.score > 0 ? '+' : ''}{symbol.sentiment.score}
            </span>
            <span className={getSentimentColor(symbol.sentiment.score)}>
              {trendIcon}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/60">Confidence</span>
          <span className="font-mono text-sm">{symbol.sentiment.confidence}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/60">Volume</span>
          <span className="font-mono text-sm">{symbol.sentiment.volume}</span>
        </div>
      </div>
    </div>
  )
}
