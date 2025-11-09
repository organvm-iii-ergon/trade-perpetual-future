import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Achievement } from '@/lib/types'
import { getRarityColor, getRarityGradient } from '@/lib/achievements'
import { CheckCircle, Lock } from '@phosphor-icons/react'

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

export function AchievementCard({ achievement, index }: AchievementCardProps) {
  const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100)
  const rarityColor = getRarityColor(achievement.rarity)
  const rarityGradient = getRarityGradient(achievement.rarity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card 
        className={`glass-strong p-5 border transition-all duration-300 ${
          achievement.unlocked 
            ? 'border-white/20 shadow-lg' 
            : 'border-white/10 opacity-75'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`relative flex-shrink-0 ${achievement.unlocked ? 'animate-pulse-scale' : ''}`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rarityGradient} flex items-center justify-center text-3xl relative`}>
              {achievement.icon}
              {achievement.unlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-long rounded-full flex items-center justify-center">
                  <CheckCircle size={16} weight="fill" className="text-white" />
                </div>
              )}
              {!achievement.unlocked && (
                <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Lock size={24} weight="duotone" className="text-white/60" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className={`font-bold text-base mb-1 ${achievement.unlocked ? 'text-foreground' : 'text-foreground/60'}`}>
                  {achievement.name}
                </h4>
                <Badge variant="outline" className={`text-xs ${rarityColor} border-current capitalize`}>
                  {achievement.rarity}
                </Badge>
              </div>
              {achievement.unlocked && achievement.reward && (
                <Badge className="bg-long/20 text-long border-long/30 text-xs whitespace-nowrap">
                  {achievement.reward.type === 'bonus' ? `+$${achievement.reward.value}` : achievement.reward.value}
                </Badge>
              )}
            </div>

            <p className="text-sm text-foreground/70 mb-3">
              {achievement.description}
            </p>

            {!achievement.unlocked && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/60">Progress</span>
                  <span className="font-mono font-semibold">
                    {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            {achievement.unlocked && achievement.unlockedAt && (
              <div className="text-xs text-foreground/50">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
