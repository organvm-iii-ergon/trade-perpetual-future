import { ChevronUp, ChevronDown } from 'lucide-react'
import type { SimMarket } from '@/types'
import { cn } from '@/lib/utils'

interface MarketCardProps {
  market: SimMarket
  isSelected: boolean
  onClick: () => void
}

export function MarketCard({ market, isSelected, onClick }: MarketCardProps) {
  const isPositive = market.change24h >= 0

  return (
    <div
      className={cn(
        'card bg-base-200 p-4 cursor-pointer transition-all duration-300 glass-hover border border-white/10',
        'hover:border-white/30 shine-effect',
        isSelected && 'ring-2 ring-accent shadow-2xl shadow-accent/30 glass-ultra scale-105'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{market.icon}</span>
            <h3 className="font-semibold text-base">{market.symbol}</h3>
          </div>
          <p className="text-xs text-base-content/60 mb-3">{market.name}</p>
          <div className="font-mono font-medium text-xl">
            ${market.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              'badge font-mono text-xs gap-1',
              isPositive ? 'badge-success' : 'badge-error'
            )}
          >
            {isPositive ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {Math.abs(market.change24h).toFixed(2)}%
          </span>
          <div className="text-xs text-base-content/60">
            Vol: {market.volume24h}
          </div>
        </div>
      </div>
    </div>
  )
}
