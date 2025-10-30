import { Card } from '@/components/ui/card'
import type { Market } from '@/lib/types'
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

interface PriceChartProps {
  market: Market
  isSelected?: boolean
  onClick?: () => void
}

export function PriceChart({ market, isSelected, onClick }: PriceChartProps) {
  const chartData = market.priceHistory.slice(-50).map((point) => ({
    timestamp: point.timestamp,
    price: point.close,
  }))

  const isPositive = market.change24h >= 0

  return (
    <div
      className={cn(
        'glass-strong rounded-3xl p-5 transition-all duration-300',
        onClick && 'cursor-pointer glass-hover',
        isSelected && 'ring-2 ring-primary/60 shadow-xl shadow-primary/20'
      )}
      onClick={onClick}
    >
      <div className="mb-3">
        <h3 className="font-semibold text-sm text-foreground/70 mb-1">{market.symbol}</h3>
        <div className="flex items-baseline gap-3">
          <div className="font-mono text-3xl font-bold">
            ${market.currentPrice.toFixed(2)}
          </div>
          <div className={`text-sm font-mono font-semibold px-2 py-1 rounded-lg ${isPositive ? 'text-long bg-long/20' : 'text-short bg-short/20'}`}>
            {isPositive ? '+' : ''}{market.change24h.toFixed(2)}%
          </div>
        </div>
        <div className="flex gap-4 text-xs text-foreground/60 mt-2">
          <span>H: ${market.high24h.toFixed(2)}</span>
          <span>L: ${market.low24h.toFixed(2)}</span>
          <span>Vol: {market.volume24h}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null
              return (
                <div className="glass-strong rounded-xl p-3 shadow-xl border border-white/20">
                  <div className="font-mono text-sm font-semibold">${Number(payload[0].value).toFixed(2)}</div>
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? 'oklch(0.75 0.22 150)' : 'oklch(0.70 0.25 10)'}
            strokeWidth={2.5}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
