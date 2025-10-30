import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { TrendUp, TrendDown, Lightning } from '@phosphor-icons/react'
import type { Market } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TradingPanelProps {
  market: Market
  balance: number
  onTrade: (side: 'long' | 'short', size: number, leverage: number) => void
}

export function TradingPanel({ market, balance, onTrade }: TradingPanelProps) {
  const [size, setSize] = useState('')
  const [leverage, setLeverage] = useState([10])
  const [selectedSide, setSelectedSide] = useState<'long' | 'short'>('long')

  const sizeNum = parseFloat(size) || 0
  const leverageNum = leverage[0]
  const positionValue = sizeNum * leverageNum
  const canTrade = sizeNum >= 0.01 && sizeNum <= balance

  const handleTrade = () => {
    if (canTrade) {
      onTrade(selectedSide, sizeNum, leverageNum)
      setSize('')
      setLeverage([10])
    }
  }

  const calculateLiquidationPrice = () => {
    if (sizeNum === 0) return 0
    const maintenanceMargin = 0.05
    if (selectedSide === 'long') {
      return market.currentPrice * (1 - 1 / leverageNum + maintenanceMargin)
    } else {
      return market.currentPrice * (1 + 1 / leverageNum - maintenanceMargin)
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Trade {market.symbol}</h2>
          <p className="text-sm text-foreground/70 font-mono">
            ${market.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs glass">
          DEMO MODE
        </Badge>
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          variant={selectedSide === 'long' ? 'default' : 'outline'}
          className={cn(
            'flex-1 gap-2 transition-all h-12',
            selectedSide === 'long' && 'bg-long text-long-foreground hover:bg-long/90 shadow-lg shadow-long/30'
          )}
          onClick={() => setSelectedSide('long')}
        >
          <TrendUp weight="duotone" size={22} />
          LONG
        </Button>
        <Button
          variant={selectedSide === 'short' ? 'default' : 'outline'}
          className={cn(
            'flex-1 gap-2 transition-all h-12',
            selectedSide === 'short' && 'bg-short text-short-foreground hover:bg-short/90 shadow-lg shadow-short/30'
          )}
          onClick={() => setSelectedSide('short')}
        >
          <TrendDown weight="duotone" size={22} />
          SHORT
        </Button>
      </div>

      <div className="space-y-5 mb-6">
        <div>
          <Label htmlFor="position-size" className="text-sm mb-2 block">
            Position Size (USD)
          </Label>
          <Input
            id="position-size"
            type="number"
            placeholder="0.00"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            step="0.01"
            min="0.01"
            className="font-mono glass h-12 text-base"
          />
          <div className="flex justify-between mt-2 text-xs text-foreground/60">
            <span>Min: $0.01</span>
            <span>Available: ${balance.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Leverage</Label>
            <Badge variant="secondary" className="gap-1 font-mono glass">
              <Lightning weight="fill" size={14} />
              {leverageNum}x
            </Badge>
          </div>
          <Slider
            value={leverage}
            onValueChange={setLeverage}
            min={1}
            max={20}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-foreground/60">
            <span>1x</span>
            <span>20x</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-2 mb-6 text-sm border border-white/10">
        <div className="flex justify-between">
          <span className="text-foreground/70">Position Value</span>
          <span className="font-mono font-semibold">${positionValue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Collateral</span>
          <span className="font-mono font-semibold">${sizeNum.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Est. Liquidation</span>
          <span className="font-mono text-destructive font-semibold">
            ${calculateLiquidationPrice().toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        className={cn(
          'w-full gap-2 text-base h-14 font-semibold transition-all',
          selectedSide === 'long' && 'bg-long text-long-foreground hover:bg-long/90 shadow-xl shadow-long/40',
          selectedSide === 'short' && 'bg-short text-short-foreground hover:bg-short/90 shadow-xl shadow-short/40'
        )}
        disabled={!canTrade}
        onClick={handleTrade}
      >
        {selectedSide === 'long' ? (
          <>
            <TrendUp weight="duotone" size={22} />
            Open Long
          </>
        ) : (
          <>
            <TrendDown weight="duotone" size={22} />
            Open Short
          </>
        )}
      </Button>

      {sizeNum > 0 && !canTrade && (
        <p className="text-xs text-destructive mt-2 text-center">
          Insufficient balance or invalid position size
        </p>
      )}
    </div>
  )
}
