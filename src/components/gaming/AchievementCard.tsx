import { motion } from 'framer-motion'
import { CheckCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRarityColor, getRarityGradient } from '@/lib/achievements'
import type { Achievement } from '@/types'

interface AchievementCardProps {
  achievement: Achievement
  index?: number
}

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  const progressPercent = Math.min(
    (achievement.progress / achievement.target) * 100,
    100
  )
  const rarityColor = getRarityColor(achievement.rarity)
  const rarityGradient = getRarityGradient(achievement.rarity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'glass-strong rounded-xl p-4 relative overflow-hidden transition-all duration-300',
        achievement.unlocked
          ? 'ring-1 ring-white/20 hover:ring-white/40'
          : 'opacity-70 hover:opacity-90'
      )}
    >
      {/* Rarity gradient accent */}
      {achievement.unlocked && (
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
            rarityGradient
          )}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon / Lock */}
        <div className="text-2xl flex-shrink-0">
          {achievement.unlocked ? (
            <span>{achievement.icon}</span>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center">
              <Lock size={16} className="text-base-content/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-sm text-base-content truncate">
              {achievement.name}
            </h4>
            <span className={cn('badge badge-xs capitalize', rarityColor)}>
              {achievement.rarity}
            </span>
          </div>

          <p className="text-xs text-base-content/60 mb-2 line-clamp-1">
            {achievement.description}
          </p>

          {/* Progress bar */}
          {!achievement.unlocked && (
            <div className="space-y-1">
              <progress
                className="progress progress-primary w-full h-1.5"
                value={progressPercent}
                max={100}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-base-content/60">
                  {achievement.progress} / {achievement.target}
                </span>
                <span className="text-xs font-mono text-base-content/40">
                  {progressPercent.toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* Unlocked state */}
          {achievement.unlocked && (
            <div className="flex items-center gap-1.5 text-xs text-long">
              <CheckCircle size={12} />
              <span>
                Unlocked
                {achievement.unlockedAt && (
                  <> {new Date(achievement.unlockedAt).toLocaleDateString()}</>
                )}
              </span>
            </div>
          )}

          {/* Reward */}
          {achievement.reward && (
            <div className="mt-1.5">
              <span className="badge badge-sm badge-ghost text-xs">
                {achievement.reward.type === 'bonus'
                  ? `+$${achievement.reward.value}`
                  : achievement.reward.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
