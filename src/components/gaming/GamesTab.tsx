import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Dice3,
  Coins,
  TrendingUp,
  Trophy,
  Zap,
  Flame,
  Sparkles,
  CircleDollarSign,
  Clock,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateGamePayout, GAME_FEE_PERCENT } from '@/lib/game-logic'
import type { Game } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────

type GameType = 'dice' | 'coinflip' | 'price-prediction'

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: number
  color?: string
}

interface CreateGameFormProps {
  gameType: GameType
  onCreateGame: (wager: number) => void
  balance: number
  isCreating: boolean
}

interface OpenGamesListProps {
  games: Game[]
  onJoinGame: (gameId: string) => void
  currentUserId: string
}

interface RecentGamesProps {
  games: Game[]
  currentUserId: string
}

interface FloatingNumberProps {
  id: string
  value: string
  x: number
  y: number
  color: string
}

interface GamesTabProps {
  games: Game[]
  balance: number
  currentUserId: string
  onCreateGame: (type: GameType, wager: number) => void
  onJoinGame: (gameId: string) => void
  totalGamesPlayed: number
  totalWinnings: number
  winRate: number
  currentStreak: number
}

// ─── Sub-components ────────────────────────────────────────────────

function StatsCard({ icon, label, value, change, color = 'text-base-content' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-200 glass-interactive p-4"
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg bg-base-300/50', color)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-base-content/60 truncate">{label}</p>
          <p className={cn('text-lg font-bold font-mono', color)}>{value}</p>
        </div>
        {change !== undefined && (
          <span
            className={cn(
              'badge text-xs font-mono',
              change >= 0 ? 'badge-success' : 'badge-error'
            )}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  )
}

function DiceAnimation({ rolling, result }: { rolling: boolean; result: number | null }) {
  const diceFaces = ['', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685']
  const [currentFace, setCurrentFace] = useState(1)

  useEffect(() => {
    if (!rolling) return
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6) + 1)
    }, 80)
    return () => clearInterval(interval)
  }, [rolling])

  const displayFace = result ?? currentFace

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={rolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
      transition={rolling ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
    >
      <div className={cn(
        'text-7xl select-none transition-all',
        rolling && 'animate-pulse text-amber',
        result && !rolling && 'text-gradient-animated'
      )}>
        {diceFaces[displayFace]}
      </div>
    </motion.div>
  )
}

function CoinFlipAnimation({ flipping, result }: { flipping: boolean; result: 'heads' | 'tails' | null }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={
        flipping
          ? { rotateY: [0, 180, 360], scale: [1, 1.3, 1] }
          : { rotateY: 0, scale: 1 }
      }
      transition={
        flipping
          ? { duration: 0.6, repeat: Infinity }
          : { duration: 0.3 }
      }
    >
      <div
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4',
          flipping && 'border-amber animate-pulse',
          result === 'heads' && !flipping && 'border-long bg-long/20 text-long',
          result === 'tails' && !flipping && 'border-short bg-short/20 text-short',
          !result && !flipping && 'border-base-content/30 text-base-content/50'
        )}
      >
        {flipping ? <Coins size={32} className="animate-spin" /> : result === 'heads' ? 'H' : result === 'tails' ? 'T' : '?'}
      </div>
    </motion.div>
  )
}

function PricePredictionChart({ active, result }: { active: boolean; result: 'up' | 'down' | null }) {
  const [points, setPoints] = useState<number[]>([50, 52, 48, 55, 53, 50])

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setPoints(prev => {
        const last = prev[prev.length - 1]
        const next = last + (Math.random() - 0.5) * 8
        return [...prev.slice(-11), Math.max(20, Math.min(80, next))]
      })
    }, 200)
    return () => clearInterval(interval)
  }, [active])

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${100 - p}`)
    .join(' ')

  return (
    <div className="relative w-full h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke={
            result === 'up'
              ? 'oklch(var(--su))'
              : result === 'down'
                ? 'oklch(var(--er))'
                : 'oklch(var(--p))'
          }
          strokeWidth="2"
          className={cn(active && 'animate-pulse')}
        />
      </svg>
      {result && !active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'absolute inset-0 flex items-center justify-center text-2xl font-bold',
            result === 'up' ? 'text-long' : 'text-short'
          )}
        >
          {result === 'up' ? <TrendingUp size={40} /> : <TrendingUp size={40} className="rotate-180" />}
        </motion.div>
      )}
    </div>
  )
}

function FloatingNumbers({ numbers }: { numbers: FloatingNumberProps[] }) {
  return (
    <AnimatePresence>
      {numbers.map(num => (
        <motion.div
          key={num.id}
          initial={{ opacity: 1, y: 0, x: num.x }}
          animate={{ opacity: 0, y: -60 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={cn('absolute pointer-events-none font-bold font-mono text-lg', num.color)}
          style={{ left: num.x, top: num.y }}
        >
          {num.value}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

function CreateGameForm({ gameType, onCreateGame, balance, isCreating }: CreateGameFormProps) {
  const [wager, setWager] = useState('')
  const [error, setError] = useState('')

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(wager)
    if (isNaN(amount) || amount <= 0) {
      setError('Enter a valid wager amount')
      return
    }
    if (amount > balance) {
      setError('Insufficient balance')
      return
    }
    if (amount < 1) {
      setError('Minimum wager is $1')
      return
    }
    setError('')
    onCreateGame(amount)
    setWager('')
  }

  const potentialPayout = wager ? calculateGamePayout(parseFloat(wager) || 0) : 0
  const fee = wager ? (parseFloat(wager) || 0) * 2 * GAME_FEE_PERCENT : 0

  const gameTypeConfig = {
    dice: { icon: <Dice3 size={20} />, label: 'Dice Roll', desc: 'Higher roll wins' },
    coinflip: { icon: <Coins size={20} />, label: 'Coin Flip', desc: '50/50 chance' },
    'price-prediction': { icon: <TrendingUp size={20} />, label: 'Price Prediction', desc: 'Predict price direction' },
  }

  const config = gameTypeConfig[gameType]

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card bg-base-200 glass p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-base-300/50 text-amber">
          {config.icon}
        </div>
        <div>
          <h3 className="font-bold text-base-content">{config.label}</h3>
          <p className="text-xs text-base-content/60">{config.desc}</p>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Wager Amount</span>
          <span className="label-text-alt text-base-content/60">
            Balance: ${balance.toFixed(2)}
          </span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">$</span>
          <input
            type="number"
            className="input input-bordered w-full pl-7 font-mono"
            placeholder="0.00"
            value={wager}
            onChange={(e) => {
              setWager(e.target.value)
              setError('')
            }}
            min="1"
            step="0.01"
          />
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickAmounts.map(amount => (
          <button
            key={amount}
            type="button"
            className={cn(
              'btn btn-sm btn-outline',
              parseFloat(wager) === amount && 'btn-active'
            )}
            onClick={() => {
              setWager(amount.toString())
              setError('')
            }}
            disabled={amount > balance}
          >
            ${amount}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline btn-warning"
          onClick={() => {
            setWager(balance.toFixed(2))
            setError('')
          }}
        >
          MAX
        </button>
      </div>

      {wager && parseFloat(wager) > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-base-300/30 rounded-lg p-3 space-y-1 text-sm"
        >
          <div className="flex justify-between">
            <span className="text-base-content/60">Pot Size</span>
            <span className="font-mono">${(parseFloat(wager) * 2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Fee ({(GAME_FEE_PERCENT * 100).toFixed(0)}%)</span>
            <span className="font-mono text-error">-${fee.toFixed(2)}</span>
          </div>
          <div className="divider my-1" />
          <div className="flex justify-between font-bold">
            <span className="text-base-content">Payout</span>
            <span className="font-mono text-long">${potentialPayout.toFixed(2)}</span>
          </div>
        </motion.div>
      )}

      <button
        type="submit"
        className={cn(
          'btn btn-primary w-full gap-2',
          isCreating && 'loading'
        )}
        disabled={isCreating || !wager || parseFloat(wager) <= 0}
      >
        {isCreating ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <Zap size={16} />
            Create Game
          </>
        )}
      </button>
    </motion.form>
  )
}

function OpenGamesList({ games, onJoinGame, currentUserId }: OpenGamesListProps) {
  const waitingGames = games.filter(g => g.status === 'waiting' && g.creatorId !== currentUserId)

  if (waitingGames.length === 0) {
    return (
      <div className="card bg-base-200 glass p-6 text-center">
        <div className="text-base-content/40 mb-2">
          <Users size={32} className="mx-auto" />
        </div>
        <p className="text-base-content/60 text-sm">No open games right now</p>
        <p className="text-base-content/40 text-xs mt-1">Create one or check back later</p>
      </div>
    )
  }

  const gameTypeIcons = {
    dice: <Dice3 size={16} />,
    coinflip: <Coins size={16} />,
    'price-prediction': <TrendingUp size={16} />,
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
        <Flame size={14} className="text-amber" />
        Open Games ({waitingGames.length})
      </h3>
      <div className="overflow-y-auto max-h-64 space-y-2 pr-1">
        <AnimatePresence mode="popLayout">
          {waitingGames.map(game => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card bg-base-200 glass-hover p-3 flex flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-base-300/50 text-amber">
                  {gameTypeIcons[game.type]}
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize">{game.type.replace('-', ' ')}</p>
                  <p className="text-xs text-base-content/60">
                    by {game.creatorId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-mono font-bold text-amber">${game.wager.toFixed(2)}</p>
                  <p className="text-xs text-base-content/60">
                    Win: ${calculateGamePayout(game.wager).toFixed(2)}
                  </p>
                </div>
                <button
                  className="btn btn-sm btn-accent gap-1"
                  onClick={() => onJoinGame(game.id)}
                >
                  <Zap size={12} />
                  Join
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function RecentGames({ games, currentUserId }: RecentGamesProps) {
  const completedGames = useMemo(
    () =>
      games
        .filter(g => g.status === 'completed')
        .sort((a, b) => (b.result?.timestamp ?? 0) - (a.result?.timestamp ?? 0))
        .slice(0, 10),
    [games]
  )

  if (completedGames.length === 0) {
    return (
      <div className="card bg-base-200 glass p-6 text-center">
        <p className="text-base-content/60 text-sm">No completed games yet</p>
      </div>
    )
  }

  const gameTypeIcons = {
    dice: <Dice3 size={14} />,
    coinflip: <Coins size={14} />,
    'price-prediction': <TrendingUp size={14} />,
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
        <Clock size={14} />
        Recent Games
      </h3>
      <div className="overflow-y-auto max-h-64 space-y-2 pr-1">
        {completedGames.map(game => {
          const won = game.result?.winnerId === currentUserId
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'card bg-base-200 p-3 flex flex-row items-center justify-between gap-3',
                won ? 'border-l-4 border-l-success' : 'border-l-4 border-l-error'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="text-base-content/60">
                  {gameTypeIcons[game.type]}
                </div>
                <div>
                  <p className="text-sm capitalize">{game.type.replace('-', ' ')}</p>
                  <p className="text-xs text-base-content/60">
                    {game.result?.timestamp
                      ? new Date(game.result.timestamp).toLocaleTimeString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    'badge text-xs font-mono',
                    won ? 'badge-success' : 'badge-error'
                  )}
                >
                  {won ? `+$${calculateGamePayout(game.wager).toFixed(2)}` : `-$${game.wager.toFixed(2)}`}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────

export function GamesTab({
  games,
  balance,
  currentUserId,
  onCreateGame,
  onJoinGame,
  totalGamesPlayed,
  totalWinnings,
  winRate,
  currentStreak,
}: GamesTabProps) {
  const [activeTab, setActiveTab] = useState<GameType>('dice')
  const [isCreating, setIsCreating] = useState(false)
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberProps[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation states
  const [diceRolling, setDiceRolling] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [coinFlipping, setCoinFlipping] = useState(false)
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null)
  const [priceActive, setPriceActive] = useState(false)
  const [priceResult, setPriceResult] = useState<'up' | 'down' | null>(null)

  const addFloatingNumber = useCallback((value: string, color: string) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const id = Math.random().toString(36).slice(2)
    const x = Math.random() * (rect.width - 60) + 30
    const y = rect.height * 0.3
    setFloatingNumbers(prev => [...prev, { id, value, x, y, color }])
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== id))
    }, 1500)
  }, [])

  const handleCreateGame = useCallback(
    async (wager: number) => {
      setIsCreating(true)

      // Trigger animation based on game type
      if (activeTab === 'dice') {
        setDiceResult(null)
        setDiceRolling(true)
        await new Promise(r => setTimeout(r, 1500))
        const result = Math.floor(Math.random() * 6) + 1
        setDiceResult(result)
        setDiceRolling(false)
      } else if (activeTab === 'coinflip') {
        setCoinResult(null)
        setCoinFlipping(true)
        await new Promise(r => setTimeout(r, 1200))
        const result = Math.random() > 0.5 ? 'heads' : 'tails'
        setCoinResult(result as 'heads' | 'tails')
        setCoinFlipping(false)
      } else {
        setPriceResult(null)
        setPriceActive(true)
        await new Promise(r => setTimeout(r, 2000))
        const result = Math.random() > 0.5 ? 'up' : 'down'
        setPriceResult(result as 'up' | 'down')
        setPriceActive(false)
      }

      onCreateGame(activeTab, wager)
      addFloatingNumber(`-$${wager.toFixed(0)}`, 'text-error')

      // Simulate result
      await new Promise(r => setTimeout(r, 500))
      const won = Math.random() > 0.5
      if (won) {
        const payout = calculateGamePayout(wager)
        addFloatingNumber(`+$${payout.toFixed(0)}`, 'text-long')
        toast.success(`You won $${payout.toFixed(2)}!`, {
          icon: <Trophy size={16} />,
        })
      } else {
        addFloatingNumber(`-$${wager.toFixed(0)}`, 'text-short')
        toast.error(`You lost $${wager.toFixed(2)}`, {
          icon: <Flame size={16} />,
        })
      }

      setIsCreating(false)
    },
    [activeTab, onCreateGame, addFloatingNumber]
  )

  const tabs: { id: GameType; label: string; icon: React.ReactNode }[] = [
    { id: 'dice', label: 'Dice', icon: <Dice3 size={16} /> },
    { id: 'coinflip', label: 'Coin Flip', icon: <Coins size={16} /> },
    { id: 'price-prediction', label: 'Price', icon: <TrendingUp size={16} /> },
  ]

  return (
    <motion.div
      ref={containerRef}
      className="relative space-y-6 p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Floating numbers overlay */}
      <FloatingNumbers numbers={floatingNumbers} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard
          icon={<Dice3 size={18} />}
          label="Games Played"
          value={totalGamesPlayed}
          color="text-ai-purple"
        />
        <StatsCard
          icon={<CircleDollarSign size={18} />}
          label="Total Winnings"
          value={`$${totalWinnings.toFixed(2)}`}
          color="text-long"
        />
        <StatsCard
          icon={<Trophy size={18} />}
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          color="text-amber"
        />
        <StatsCard
          icon={<Flame size={18} />}
          label="Streak"
          value={currentStreak}
          color={currentStreak >= 3 ? 'text-amber' : 'text-base-content'}
        />
      </div>

      {/* Game type tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-300/50 p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            className={cn(
              'tab gap-2 transition-all',
              activeTab === tab.id && 'tab-active'
            )}
            onClick={() => {
              setActiveTab(tab.id)
              setDiceResult(null)
              setCoinResult(null)
              setPriceResult(null)
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Game animation area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card bg-base-200 glass p-8 flex items-center justify-center min-h-[140px]">
            {activeTab === 'dice' && (
              <DiceAnimation rolling={diceRolling} result={diceResult} />
            )}
            {activeTab === 'coinflip' && (
              <CoinFlipAnimation flipping={coinFlipping} result={coinResult} />
            )}
            {activeTab === 'price-prediction' && (
              <PricePredictionChart active={priceActive} result={priceResult} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Create game form + open games + recent games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CreateGameForm
            gameType={activeTab}
            onCreateGame={handleCreateGame}
            balance={balance}
            isCreating={isCreating}
          />
        </div>
        <div className="space-y-6">
          <OpenGamesList
            games={games}
            onJoinGame={onJoinGame}
            currentUserId={currentUserId}
          />
          <RecentGames games={games} currentUserId={currentUserId} />
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-center gap-2 text-xs text-base-content/40">
        <Sparkles size={12} />
        <span>All games are provably fair using verifiable seeds</span>
        <Sparkles size={12} />
      </div>
    </motion.div>
  )
}
