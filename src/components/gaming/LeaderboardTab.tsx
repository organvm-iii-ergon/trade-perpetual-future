import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTierIcon } from '@/lib/affiliate'
import type { LeaderboardEntry } from '@/types'

type LeaderboardSort = 'volume' | 'pnl' | 'winRate'

interface LeaderboardTabProps {
  entries: LeaderboardEntry[]
  currentUserId: string
  onShareProfile?: (userId: string) => void
}

const sortConfig: { id: LeaderboardSort; label: string }[] = [
  { id: 'volume', label: 'Volume' },
  { id: 'pnl', label: 'PnL' },
  { id: 'winRate', label: 'Win Rate' },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="text-lg">🥇</span>
  }
  if (rank === 2) {
    return <span className="text-lg">🥈</span>
  }
  if (rank === 3) {
    return <span className="text-lg">🥉</span>
  }
  return (
    <span className="text-xs font-mono text-base-content/60 w-6 text-center">
      #{rank}
    </span>
  )
}

function LeaderboardRow({
  entry,
  isCurrentUser,
  index,
  onShare,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
  index: number
  onShare?: () => void
}) {
  const tierEmoji = getTierIcon(entry.tier)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
        isCurrentUser
          ? 'glass-strong ring-1 ring-accent/50 bg-accent/5'
          : 'glass-hover',
        entry.rank <= 3 && 'bg-amber/5'
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 flex justify-center">
        <RankBadge rank={entry.rank} />
      </div>

      {/* Avatar */}
      <div className="avatar flex-shrink-0">
        <div className="w-9 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1">
          {entry.avatarUrl ? (
            <img src={entry.avatarUrl} alt={entry.username} />
          ) : (
            <div className="w-full h-full bg-base-300 flex items-center justify-center text-base-content/60 text-sm font-bold">
              {entry.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-base-content truncate">
            {entry.username}
          </span>
          <span className="text-xs" title={entry.tier}>
            {tierEmoji}
          </span>
          {isCurrentUser && (
            <span className="badge badge-xs badge-accent">You</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-base-content/60 mt-0.5">
          <span className="font-mono">
            Vol: ${entry.totalVolume >= 1000
              ? `${(entry.totalVolume / 1000).toFixed(1)}K`
              : entry.totalVolume.toFixed(0)}
          </span>
          <span className="font-mono">
            WR: {entry.winRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Value / PnL */}
      <div className="text-right flex-shrink-0">
        <div className={cn(
          'font-bold font-mono text-sm',
          entry.totalPnl >= 0 ? 'text-long' : 'text-short'
        )}>
          {entry.totalPnl >= 0 ? '+' : ''}${entry.totalPnl.toFixed(2)}
        </div>
        {entry.change !== undefined && (
          <div className="flex items-center justify-end gap-0.5 text-xs">
            {entry.change >= 0 ? (
              <TrendingUp size={10} className="text-long" />
            ) : (
              <TrendingDown size={10} className="text-short" />
            )}
            <span
              className={cn(
                'font-mono',
                entry.change >= 0 ? 'text-long' : 'text-short'
              )}
            >
              {entry.change >= 0 ? '+' : ''}{entry.change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Share */}
      {onShare && (
        <button
          className="btn btn-ghost btn-xs btn-square flex-shrink-0"
          onClick={onShare}
          title="Share profile"
        >
          <Share2 size={12} />
        </button>
      )}
    </motion.div>
  )
}

export function LeaderboardTab({
  entries,
  currentUserId,
  onShareProfile,
}: LeaderboardTabProps) {
  const [sortBy, setSortBy] = useState<LeaderboardSort>('volume')

  const sortedEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.totalVolume - a.totalVolume
        case 'pnl':
          return b.totalPnl - a.totalPnl
        case 'winRate':
          return b.winRate - a.winRate
        default:
          return 0
      }
    })
    return sorted.map((entry, i) => ({ ...entry, rank: i + 1 }))
  }, [entries, sortBy])

  const currentUserEntry = sortedEntries.find(e => e.userId === currentUserId)

  return (
    <motion.div
      className="space-y-5 p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="glass-strong rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber/10">
              <Trophy size={20} className="text-amber" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-base-content">Leaderboard</h2>
              <p className="text-xs text-base-content/60">
                {entries.length} traders competing
              </p>
            </div>
          </div>

          {currentUserEntry && (
            <div className="text-right">
              <p className="text-xs text-base-content/60">Your Rank</p>
              <p className="font-bold font-mono text-amber text-lg">
                #{currentUserEntry.rank}
              </p>
            </div>
          )}
        </div>

        {/* Sort tabs */}
        <div role="tablist" className="tabs tabs-boxed tabs-sm bg-base-300/50">
          {sortConfig.map(sort => (
            <button
              key={sort.id}
              role="tab"
              className={cn(
                'tab text-xs',
                sortBy === sort.id && 'tab-active'
              )}
              onClick={() => setSortBy(sort.id)}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, i) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === currentUserId}
                index={i}
                onShare={
                  onShareProfile
                    ? () => onShareProfile(entry.userId)
                    : undefined
                }
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Trophy size={32} className="mx-auto text-base-content/30 mb-3" />
              <p className="text-base-content/60 text-sm">No leaderboard data yet</p>
              <p className="text-base-content/40 text-xs mt-1">
                Start trading to appear on the leaderboard
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
