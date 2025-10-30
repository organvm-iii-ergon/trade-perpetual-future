import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, TrendUp, TrendDown, Lightning } from '@phosphor-icons/react'
import type { Position } from '@/lib/types'
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
          <Badge
            variant={isLong ? 'default' : 'destructive'}
            className={cn(
              'gap-1',
              isLong && 'bg-long text-long-foreground hover:bg-long'
            )}
          >
            {isLong ? <TrendUp weight="duotone" size={14} /> : <TrendDown weight="duotone" size={14} />}
            {isLong ? 'LONG' : 'SHORT'}
          </Badge>
          <span className="font-semibold text-lg">{position.marketSymbol}</span>
          <Badge variant="outline" className="gap-1 text-xs glass">
            <Lightning weight="fill" size={12} />
            {position.leverage}x
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10"
          onClick={() => onClose(position.id)}
        >
          <X size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <div className="text-foreground/60 text-xs mb-1">Size</div>
          <div className="font-mono font-semibold">${position.size.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-foreground/60 text-xs mb-1">Entry Price</div>
          <div className="font-mono font-semibold">${position.entryPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-foreground/60 text-xs mb-1">Current Price</div>
          <div className="font-mono font-semibold">${position.currentPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-foreground/60 text-xs mb-1">Liq. Price</div>
          <div className="font-mono text-destructive text-xs font-semibold">
            ${position.liquidationPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'glass rounded-xl p-3 flex items-center justify-between border',
          isProfitable ? 'bg-long/20 border-long/30' : 'bg-short/20 border-short/30'
        )}
      >
        <div>
          <div className="text-xs text-foreground/70 mb-1">Unrealized P&L</div>
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
