import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, TrendUp, TrendDown, ShareNetwork } from '@phosphor-icons/react'
import type { LeaderboardEntry } from '@/lib/types'
import { getTierIcon } from '@/lib/affiliate'

interface LeaderboardTabProps {
  pnlLeaderboard: LeaderboardEntry[]
  volumeLeaderboard: LeaderboardEntry[]
  affiliateLeaderboard: LeaderboardEntry[]
  currentUserId: string
}

export function LeaderboardTab({
  pnlLeaderboard,
  volumeLeaderboard,
  affiliateLeaderboard,
  currentUserId
}: LeaderboardTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy size={28} weight="fill" className="text-amber" />
          Leaderboard
        </h2>
        <p className="text-muted-foreground mt-1">Top performers across the platform</p>
      </div>

      <Tabs defaultValue="pnl" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pnl" className="gap-2">
            <TrendUp size={16} />
            P&L
          </TabsTrigger>
          <TabsTrigger value="volume" className="gap-2">
            <TrendUp size={16} />
            Volume
          </TabsTrigger>
          <TabsTrigger value="affiliate" className="gap-2">
            <ShareNetwork size={16} />
            Affiliate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-3 mt-6">
          {pnlLeaderboard.map((entry) => (
            <LeaderboardCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
              valueLabel="P&L"
              valueColor={entry.value >= 0 ? 'text-long' : 'text-short'}
              valuePrefix={entry.value >= 0 ? '+$' : '-$'}
            />
          ))}
        </TabsContent>

        <TabsContent value="volume" className="space-y-3 mt-6">
          {volumeLeaderboard.map((entry) => (
            <LeaderboardCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
              valueLabel="Volume"
              valueColor="text-foreground"
              valuePrefix="$"
            />
          ))}
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-3 mt-6">
          {affiliateLeaderboard.map((entry) => (
            <LeaderboardCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
              valueLabel="Commissions"
              valueColor="text-cyan"
              valuePrefix="$"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface LeaderboardCardProps {
  entry: LeaderboardEntry
  isCurrentUser: boolean
  valueLabel: string
  valueColor: string
  valuePrefix: string
}

function LeaderboardCard({ entry, isCurrentUser, valueLabel, valueColor, valuePrefix }: LeaderboardCardProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: 'text-amber' }
    if (rank === 2) return { icon: '🥈', color: 'text-gray-400' }
    if (rank === 3) return { icon: '🥉', color: 'text-amber-700' }
    return { icon: `#${rank}`, color: 'text-muted-foreground' }
  }

  const rankBadge = getRankBadge(entry.rank)

  return (
    <Card className={`p-4 ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold w-12 text-center">
            <span className={rankBadge.color}>{rankBadge.icon}</span>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={entry.avatarUrl} />
            <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold flex items-center gap-2">
              {entry.username}
              {isCurrentUser && <Badge variant="secondary">You</Badge>}
            </div>
            <div className="text-xs text-muted-foreground">{valueLabel}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-mono text-xl font-bold ${valueColor}`}>
            {valuePrefix}{Math.abs(entry.value).toFixed(2)}
          </div>
          {entry.change !== undefined && (
            <div className={`text-xs flex items-center justify-end gap-1 ${
              entry.change >= 0 ? 'text-long' : 'text-short'
            }`}>
              {entry.change >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
              {Math.abs(entry.change)} positions
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
