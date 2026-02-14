import { useState, useCallback, useRef } from 'react'
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

interface Particle {
  id: string
  x: number
  y: number
  color: string
  size: number
  delay: number
}

interface EnhancedGamesTabProps {
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

// ─── Particle Effects ──────────────────────────────────────────────

function ParticleField({ active, color }: { active: boolean; color: string }) {
  const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
    id: `particle-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
  }))

  if (!active) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -30],
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// ─── Game Type Selection Card ──────────────────────────────────────

function GameTypeCard({
  type,
  icon,
  label,
  description,
  isSelected,
  onSelect,
  stats,
}: {
  type: GameType
  icon: React.ReactNode
  label: string
  description: string
  isSelected: boolean
  onSelect: () => void
  stats: { played: number; won: number }
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'card bg-base-200 glass-interactive cursor-pointer p-4 transition-all duration-300 relative overflow-hidden',
        isSelected && 'ring-2 ring-accent shadow-xl shadow-accent/20'
      )}
    >
      <ParticleField active={isSelected} color="oklch(0.75 0.15 80)" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={cn(
              'p-2.5 rounded-xl transition-all',
              isSelected ? 'bg-accent/20 text-accent' : 'bg-base-300/50 text-base-content/60'
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-base-content">{label}</h3>
            <p className="text-xs text-base-content/60">{description}</p>
          </div>
        </div>
        {stats.played > 0 && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-base-content/10">
            <div className="text-xs text-base-content/60">
              <span className="font-mono font-bold text-base-content">{stats.played}</span> played
            </div>
            <div className="text-xs text-base-content/60">
              <span className="font-mono font-bold text-long">{stats.won}</span> won
            </div>
            <div className="text-xs text-base-content/60">
              <span className="font-mono font-bold text-amber">
                {stats.played > 0 ? ((stats.won / stats.played) * 100).toFixed(0) : 0}%
              </span>{' '}
              rate
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Enhanced Stats Banner ─────────────────────────────────────────

function StatsBanner({
  totalPlayed,
  totalWinnings,
  winRate,
  streak,
}: {
  totalPlayed: number
  totalWinnings: number
  winRate: number
  streak: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-200 glass-strong p-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Dice3 size={16} className="text-ai-purple" />
            <div>
              <p className="text-xs text-base-content/60">Games</p>
              <p className="font-bold font-mono text-base-content">{totalPlayed}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={16} className="text-long" />
            <div>
              <p className="text-xs text-base-content/60">Winnings</p>
              <p className="font-bold font-mono text-long">${totalWinnings.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber" />
            <div>
              <p className="text-xs text-base-content/60">Win Rate</p>
              <p className="font-bold font-mono text-amber">{winRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/10 rounded-full"
          >
            <Flame size={14} className="text-amber animate-pulse" />
            <span className="text-sm font-bold text-amber">{streak} Streak!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Wager Input ───────────────────────────────────────────────────

function WagerInput({
  balance,
  onSubmit,
  isCreating,
}: {
  balance: number
  onSubmit: (wager: number) => void
  isCreating: boolean
}) {
  const [wager, setWager] = useState('')
  const [error, setError] = useState('')

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(wager)
    if (isNaN(amount) || amount <= 0) {
      setError('Enter a valid wager')
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
    onSubmit(amount)
    setWager('')
  }

  const potentialPayout = wager ? calculateGamePayout(parseFloat(wager) || 0) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Wager</span>
          <span className="label-text-alt text-base-content/60">
            Balance: <span className="font-mono">${balance.toFixed(2)}</span>
          </span>
        </label>
        <div className="join w-full">
          <span className="join-item btn btn-disabled bg-base-300">$</span>
          <input
            type="number"
            className="input input-bordered join-item flex-1 font-mono"
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
              'btn btn-xs btn-outline',
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
      </div>

      {wager && parseFloat(wager) > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between text-sm bg-base-300/30 rounded-lg px-3 py-2"
        >
          <span className="text-base-content/60">Potential Payout</span>
          <span className="font-mono font-bold text-long">${potentialPayout.toFixed(2)}</span>
        </motion.div>
      )}

      <button
        type="submit"
        className={cn('btn btn-primary w-full gap-2')}
        disabled={isCreating || !wager || parseFloat(wager) <= 0}
      >
        {isCreating ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <Zap size={16} />
            Play Now
          </>
        )}
      </button>
    </form>
  )
}

// ─── Open Games Panel ──────────────────────────────────────────────

function OpenGamesPanel({
  games,
  onJoinGame,
  currentUserId,
}: {
  games: Game[]
  onJoinGame: (gameId: string) => void
  currentUserId: string
}) {
  const waitingGames = games.filter(g => g.status === 'waiting' && g.creatorId !== currentUserId)

  const gameTypeIcons: Record<GameType, React.ReactNode> = {
    dice: <Dice3 size={14} />,
    coinflip: <Coins size={14} />,
    'price-prediction': <TrendingUp size={14} />,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
          <Users size={14} />
          Open Games
        </h3>
        <span className="badge badge-sm badge-ghost">{waitingGames.length}</span>
      </div>

      <div className="overflow-y-auto max-h-72 space-y-2">
        {waitingGames.length === 0 ? (
          <div className="text-center py-8 text-base-content/40">
            <Users size={24} className="mx-auto mb-2" />
            <p className="text-xs">No open games</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {waitingGames.map(game => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card bg-base-200 glass-hover p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="text-amber">{gameTypeIcons[game.type]}</div>
                    <div>
                      <p className="text-sm font-semibold capitalize">
                        {game.type.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-base-content/60 font-mono">
                        {game.creatorId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber">
                      ${game.wager.toFixed(2)}
                    </span>
                    <button
                      className="btn btn-xs btn-accent"
                      onClick={() => onJoinGame(game.id)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ─── Recent Activity ───────────────────────────────────────────────

function RecentActivity({ games, currentUserId }: { games: Game[]; currentUserId: string }) {
  const completed = games
    .filter(g => g.status === 'completed')
    .sort((a, b) => (b.result?.timestamp ?? 0) - (a.result?.timestamp ?? 0))
    .slice(0, 5)

  if (completed.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
        <Clock size={14} />
        Recent Activity
      </h3>
      <div className="space-y-1.5">
        {completed.map(game => {
          const won = game.result?.winnerId === currentUserId
          return (
            <div
              key={game.id}
              className="flex items-center justify-between text-sm px-2 py-1.5"
            >
              <div className="flex items-center gap-2 text-base-content/70">
                <span className={won ? 'text-long' : 'text-short'}>
                  {won ? <Trophy size={12} /> : <Flame size={12} />}
                </span>
                <span className="capitalize">{game.type.replace('-', ' ')}</span>
              </div>
              <span
                className={cn(
                  'font-mono text-xs font-bold',
                  won ? 'text-long' : 'text-short'
                )}
              >
                {won
                  ? `+$${calculateGamePayout(game.wager).toFixed(2)}`
                  : `-$${game.wager.toFixed(2)}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────

export function EnhancedGamesTab({
  games,
  balance,
  currentUserId,
  onCreateGame,
  onJoinGame,
  totalGamesPlayed,
  totalWinnings,
  winRate,
  currentStreak,
}: EnhancedGamesTabProps) {
  const [selectedType, setSelectedType] = useState<GameType>('dice')
  const [isCreating, setIsCreating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const gameStats = (type: GameType) => {
    const typeGames = games.filter(g => g.type === type)
    const completed = typeGames.filter(g => g.status === 'completed')
    const won = completed.filter(g => g.result?.winnerId === currentUserId)
    return { played: completed.length, won: won.length }
  }

  const handleCreateGame = useCallback(
    async (wager: number) => {
      setIsCreating(true)
      try {
        onCreateGame(selectedType, wager)
        toast.success('Game created!', {
          icon: <Sparkles size={16} />,
          description: `${selectedType} game for $${wager.toFixed(2)}`,
        })
      } finally {
        setTimeout(() => setIsCreating(false), 1500)
      }
    },
    [selectedType, onCreateGame]
  )

  const gameTypes: { type: GameType; icon: React.ReactNode; label: string; desc: string }[] = [
    { type: 'dice', icon: <Dice3 size={22} />, label: 'Dice Roll', desc: 'Higher roll wins the pot' },
    { type: 'coinflip', icon: <Coins size={22} />, label: 'Coin Flip', desc: '50/50 heads or tails' },
    { type: 'price-prediction', icon: <TrendingUp size={22} />, label: 'Price Prediction', desc: 'Predict the next move' },
  ]

  return (
    <motion.div
      ref={containerRef}
      className="space-y-6 p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Stats banner */}
      <StatsBanner
        totalPlayed={totalGamesPlayed}
        totalWinnings={totalWinnings}
        winRate={winRate}
        streak={currentStreak}
      />

      {/* Game type selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {gameTypes.map(gt => (
          <GameTypeCard
            key={gt.type}
            type={gt.type}
            icon={gt.icon}
            label={gt.label}
            description={gt.desc}
            isSelected={selectedType === gt.type}
            onSelect={() => setSelectedType(gt.type)}
            stats={gameStats(gt.type)}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create game */}
        <div className="lg:col-span-1">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-200 glass p-5"
          >
            <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              Create Game
            </h3>
            <WagerInput
              balance={balance}
              onSubmit={handleCreateGame}
              isCreating={isCreating}
            />
          </motion.div>
        </div>

        {/* Open games + recent */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 glass p-5">
            <OpenGamesPanel
              games={games}
              onJoinGame={onJoinGame}
              currentUserId={currentUserId}
            />
          </div>
          <div className="card bg-base-200 glass p-5">
            <RecentActivity games={games} currentUserId={currentUserId} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-base-content/40">
        <Sparkles size={12} />
        <span>Provably fair gaming powered by verifiable seeds</span>
        <Sparkles size={12} />
      </div>
    </motion.div>
  )
}
