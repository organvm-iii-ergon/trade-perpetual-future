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
    <Card
      className={cn(
        'p-4 transition-all duration-200',
        onClick && 'cursor-pointer hover:scale-[1.02] hover:shadow-lg',
        isSelected && 'ring-2 ring-primary shadow-xl'
      )}
      onClick={onClick}
    >
      <div className="mb-2">
        <h3 className="font-semibold text-sm text-muted-foreground">{market.symbol}</h3>
        <div className="flex items-baseline gap-3">
          <div className="font-mono text-2xl font-bold">
            ${market.currentPrice.toFixed(2)}
          </div>
          <div className={`text-sm font-mono ${isPositive ? 'text-long' : 'text-short'}`}>
            {isPositive ? '+' : ''}{market.change24h.toFixed(2)}%
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
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
                <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                  <div className="font-mono text-sm">${Number(payload[0].value).toFixed(2)}</div>
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? 'oklch(0.75 0.20 145)' : 'oklch(0.70 0.25 350)'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
