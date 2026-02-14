import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AddSymbolDialogProps {
  onAdd: (ticker: string) => void
}

const POPULAR_SYMBOLS = [
  { ticker: 'BTC', name: 'Bitcoin' },
  { ticker: 'ETH', name: 'Ethereum' },
  { ticker: 'SOL', name: 'Solana' },
  { ticker: 'AAPL', name: 'Apple' },
  { ticker: 'NVDA', name: 'NVIDIA' },
  { ticker: 'MSFT', name: 'Microsoft' }
]

export function AddSymbolDialog({ onAdd }: AddSymbolDialogProps) {
  const [open, setOpen] = useState(false)
  const [ticker, setTicker] = useState('')

  const handleAdd = () => {
    if (!ticker.trim()) {
      toast.error('Please enter a symbol')
      return
    }
    const normalizedTicker = ticker.trim().toUpperCase()
    onAdd(normalizedTicker)
    setTicker('')
    setOpen(false)
    toast.success(`Added ${normalizedTicker} to watchlist`)
  }

  const handleQuickAdd = (symbol: string) => {
    onAdd(symbol)
    setOpen(false)
    toast.success(`Added ${symbol} to watchlist`)
  }

  return (
    <>
      <button className="btn btn-primary gap-2" onClick={() => setOpen(true)}>
        <Plus size={18} />
        Add Symbol
      </button>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box glass-strong">
            <h3 className="font-bold text-lg mb-4">Add Symbol to Watchlist</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Symbol</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ticker (e.g., SOL, BTC)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  className="input input-bordered font-mono"
                />
              </div>

              <button className="btn btn-primary w-full" onClick={handleAdd}>
                Add to Watchlist
              </button>

              <div className="divider">Popular Symbols</div>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_SYMBOLS.map((symbol) => (
                  <button
                    key={symbol.ticker}
                    className="btn btn-outline btn-sm justify-start"
                    onClick={() => handleQuickAdd(symbol.ticker)}
                  >
                    <span className="font-mono font-bold">{symbol.ticker}</span>
                    <span className="text-base-content/60 ml-2 text-xs">{symbol.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
