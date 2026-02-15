import { MarketCard } from '@/components/markets/MarketCard'
import { SymbolCard } from '@/components/markets/SymbolCard'
import { PriceChart } from '@/components/markets/PriceChart'
import { RealityCard } from '@/components/markets/RealityCard'
import { AddSymbolDialog } from '@/components/markets/AddSymbolDialog'
import { PositionCard } from '@/components/markets/PositionCard'
import type { Symbol, Reality, SimMarket, Position } from '@/types'

interface MarketsTabProps {
  simMarkets: SimMarket[]
  symbols: Symbol[]
  selectedSymbol: string | null
  realities: Reality[]
  simPositions: Position[]
  isLive?: boolean
  onSelectSymbol: (ticker: string) => void
  onAddSymbol: (ticker: string) => void
  onCloseSimPosition: (id: string) => void
}

export default function MarketsTab({
  simMarkets,
  symbols,
  selectedSymbol,
  realities,
  simPositions,
  isLive,
  onSelectSymbol,
  onAddSymbol,
  onCloseSimPosition,
}: MarketsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Markets
          {isLive !== undefined && (
            <span className={`badge badge-sm ${isLive ? 'badge-success' : 'badge-warning'}`}>
              {isLive ? 'Live' : 'Simulated'}
            </span>
          )}
        </h2>
        <AddSymbolDialog onAdd={onAddSymbol} />
      </div>

      {simMarkets.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simMarkets.map((m) => (
            <PriceChart key={m.symbol} market={m} />
          ))}
        </div>
      )}

      {symbols.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-8">Watchlist</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {symbols.map((sym) => (
              <SymbolCard
                key={sym.ticker}
                symbol={sym}
                onClick={() => onSelectSymbol(sym.ticker)}
                isSelected={selectedSymbol === sym.ticker}
              />
            ))}
          </div>
        </>
      )}

      {realities.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-8">Reality Projections — {selectedSymbol}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {realities.map((r, i) => (
              <RealityCard key={r.id} reality={r} index={i} />
            ))}
          </div>
        </>
      )}

      {simPositions.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-8">Sim Positions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {simPositions.map(p => (
              <PositionCard key={p.id} position={p} onClose={onCloseSimPosition} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
