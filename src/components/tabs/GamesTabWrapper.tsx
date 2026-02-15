import { GamesTab } from '@/components/gaming/GamesTab'
import { AchievementsTab } from '@/components/gaming/AchievementsTab'
import { LeaderboardTab } from '@/components/gaming/LeaderboardTab'
import type { Game, Achievement, LeaderboardEntry } from '@/types'

interface GamesTabWrapperProps {
  games: Game[]
  balance: number
  currentUserId: string
  achievements: Achievement[]
  leaderboard: LeaderboardEntry[]
  onCreateGame: (type: Game['type'], wager: number) => void
  onJoinGame: (gameId: string) => void
  gameMode?: 'local' | 'on-chain'
  onModeChange?: (mode: 'local' | 'on-chain') => void
}

export default function GamesTabWrapper({
  games,
  balance,
  currentUserId,
  achievements,
  leaderboard,
  onCreateGame,
  onJoinGame,
  gameMode,
  onModeChange,
}: GamesTabWrapperProps) {
  return (
    <div className="space-y-6">
      <div role="tablist" className="tabs tabs-boxed mb-4">
        <button className="tab tab-active">Arena</button>
      </div>
      <GamesTab
        games={games}
        balance={balance}
        currentUserId={currentUserId}
        onCreateGame={onCreateGame}
        onJoinGame={onJoinGame}
        totalGamesPlayed={games.filter(g => g.status === 'completed').length}
        totalWinnings={0}
        winRate={50}
        currentStreak={0}
        gameMode={gameMode}
        onModeChange={onModeChange}
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <AchievementsTab
          achievements={achievements}
          totalUnlocked={achievements.filter(a => a.unlocked).length}
        />
        <LeaderboardTab
          entries={leaderboard}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  )
}
