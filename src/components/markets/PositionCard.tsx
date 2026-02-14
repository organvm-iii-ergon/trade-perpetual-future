import { TrendingUp, TrendingDown, X, Zap } from 'lucide-react'
import { GlassTooltip } from '@/components/common/GlassTooltip'
import type { Position } from '@/types'
import { cn } from '@/lib/utils'

interface PositionCardProps {
  position: Position
  onClose: (id: string) => void
}

export function PositionCard({ position, onClose }: PositionCardProps) {
  const isLong = position.side === 'long'
  const isProfitable = position.unrealizedPnl >= 0

  return (
    <div className="glass-strong rounded-2xl p-4 animate-slide-up border border-white/10">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'badge gap-1',
              isLong ? 'badge-success' : 'badge-error'
            )}
          >
            {isLong ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isLong ? 'LONG' : 'SHORT'}
          </span>
          <span className="font-semibold text-lg">{position.marketSymbol}</span>
          <span className="badge badge-outline gap-1 text-xs glass">
            <Zap size={12} />
            {position.leverage}x
          </span>
        </div>
        <button
          className="btn btn-ghost btn-square btn-sm"
          onClick={() => onClose(position.id)}
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <GlassTooltip content={<div className="text-xs">Your collateral amount</div>}>
          <div className="cursor-help">
            <div className="text-base-content/60 text-xs mb-1">Size</div>
            <div className="font-mono font-semibold">${position.size.toFixed(2)}</div>
          </div>
        </GlassTooltip>
        <GlassTooltip content={<div className="text-xs">Price when position was opened</div>}>
          <div className="cursor-help">
            <div className="text-base-content/60 text-xs mb-1">Entry Price</div>
            <div className="font-mono font-semibold">${position.entryPrice.toFixed(2)}</div>
          </div>
        </GlassTooltip>
        <GlassTooltip
          content={
            <div className="text-xs space-y-1">
              <div>Live market price</div>
              <div className={position.currentPrice > position.entryPrice ? 'text-long' : 'text-short'}>
                {position.currentPrice > position.entryPrice ? '\u2191' : '\u2193'}
                {' '}
                {Math.abs(((position.currentPrice - position.entryPrice) / position.entryPrice) * 100).toFixed(2)}%
              </div>
            </div>
          }
        >
          <div className="cursor-help">
            <div className="text-base-content/60 text-xs mb-1">Current Price</div>
            <div className="font-mono font-semibold">${position.currentPrice.toFixed(2)}</div>
          </div>
        </GlassTooltip>
        <GlassTooltip
          content={
            <div className="text-xs space-y-1">
              <div className="font-semibold">Liquidation Price</div>
              <div className="text-error">Position closes at this price</div>
              <div className="text-base-content/70">
                {Math.abs(((position.liquidationPrice - position.currentPrice) / position.currentPrice) * 100).toFixed(1)}% away
              </div>
            </div>
          }
        >
          <div className="cursor-help">
            <div className="text-base-content/60 text-xs mb-1">Liq. Price</div>
            <div className="font-mono text-error text-xs font-semibold">
              ${position.liquidationPrice.toFixed(2)}
            </div>
          </div>
        </GlassTooltip>
      </div>

      <div
        className={cn(
          'glass rounded-xl p-3 flex items-center justify-between border',
          isProfitable ? 'bg-long/20 border-long/30' : 'bg-short/20 border-short/30'
        )}
      >
        <div>
          <div className="text-xs text-base-content/70 mb-1">Unrealized P&L</div>
          <div className={cn('font-mono font-bold text-xl', isProfitable ? 'text-long' : 'text-short')}>
            {isProfitable ? '+' : ''}${position.unrealizedPnl.toFixed(2)}
          </div>
        </div>
        <div className={cn('font-mono text-3xl font-bold', isProfitable ? 'text-long' : 'text-short')}>
          {isProfitable ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
