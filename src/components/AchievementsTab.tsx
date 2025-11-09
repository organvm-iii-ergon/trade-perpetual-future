import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AchievementCard } from './AchievementCard'
import type { Achievement } from '@/lib/types'
import { Trophy, TrendUp, DiceThree, ShareNetwork, Sparkle } from '@phosphor-icons/react'

interface AchievementsTabProps {
  achievements: Achievement[]
}

export function AchievementsTab({ achievements }: AchievementsTabProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

  const tradingAchievements = achievements.filter(a => a.category === 'trading')
  const gamingAchievements = achievements.filter(a => a.category === 'gaming')
  const socialAchievements = achievements.filter(a => a.category === 'social')
  const milestoneAchievements = achievements.filter(a => a.category === 'milestone')

  const rarityCount = {
    common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Trophy size={32} weight="duotone" className="text-amber" />
          Achievements
        </h2>
        <p className="text-foreground/70">
          Complete challenges to earn badges, bonuses, and bragging rights
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-strong p-6 border-white/10">
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient-animated mb-2">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-sm text-foreground/70">
              Achievements Unlocked
            </div>
            <div className="text-xs text-foreground/50 mt-1">
              {progressPercent}% Complete
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border-white/10">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/70">Common</span>
              <Badge variant="outline" className="text-xs">{rarityCount.common}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyan">Rare</span>
              <Badge variant="outline" className="text-xs text-cyan">{rarityCount.rare}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-ai-purple">Epic</span>
              <Badge variant="outline" className="text-xs text-ai-purple">{rarityCount.epic}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber">Legendary</span>
              <Badge variant="outline" className="text-xs text-amber">{rarityCount.legendary}</Badge>
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border-white/10">
          <div className="text-center">
            <Sparkle size={32} weight="duotone" className="mx-auto mb-2 text-ai-purple" />
            <div className="text-2xl font-bold mb-1">
              {achievements.filter(a => a.unlocked && a.reward?.type === 'badge').length}
            </div>
            <div className="text-xs text-foreground/70">
              Badges Earned
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border-white/10">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-2xl font-bold mb-1 text-long">
              ${achievements
                .filter(a => a.unlocked && a.reward?.type === 'bonus')
                .reduce((sum, a) => sum + (Number(a.reward?.value) || 0), 0)
                .toFixed(0)}
            </div>
            <div className="text-xs text-foreground/70">
              Bonus Earned
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="glass-strong grid w-full grid-cols-5 p-1 border border-white/20">
          <TabsTrigger value="all">
            All ({totalCount})
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-1">
            <TrendUp size={16} weight="duotone" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="gaming" className="gap-1">
            <DiceThree size={16} weight="duotone" />
            Gaming
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1">
            <ShareNetwork size={16} weight="duotone" />
            Social
          </TabsTrigger>
          <TabsTrigger value="milestone" className="gap-1">
            <Trophy size={16} weight="duotone" />
            Milestones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="trading" className="space-y-3">
          {tradingAchievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="gaming" className="space-y-3">
          {gamingAchievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="social" className="space-y-3">
          {socialAchievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="milestone" className="space-y-3">
          {milestoneAchievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
