import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRarityColor, getRarityGradient } from '@/lib/achievements'
import type { Achievement } from '@/types'

interface AchievementUnlockNotificationProps {
  achievement: Achievement | null
  onDismiss: () => void
  autoDismissMs?: number
}

export function AchievementUnlockNotification({
  achievement,
  onDismiss,
  autoDismissMs = 5000,
}: AchievementUnlockNotificationProps) {
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(onDismiss, autoDismissMs)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss, autoDismissMs])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm"
        >
          <div className="glass-ultra rounded-2xl p-4 relative overflow-hidden shadow-2xl">
            {/* Animated gradient border */}
            <div
              className={cn(
                'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r animate-pulse',
                getRarityGradient(achievement.rarity)
              )}
            />

            {/* Sparkle particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${20 + Math.random() * 60}%`,
                    y: `${10 + Math.random() * 80}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Sparkles size={10} className="text-amber" />
                </motion.div>
              ))}
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-3">
              {/* Achievement icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-3xl flex-shrink-0"
              >
                {achievement.icon}
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles size={12} className="text-amber" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber">
                      Achievement Unlocked!
                    </span>
                  </div>
                  <h3 className="font-bold text-base-content text-sm">
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {achievement.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn('badge badge-xs capitalize', getRarityColor(achievement.rarity))}>
                      {achievement.rarity}
                    </span>
                    {achievement.reward && (
                      <span className="badge badge-xs badge-ghost">
                        {achievement.reward.type === 'bonus'
                          ? `+$${achievement.reward.value}`
                          : achievement.reward.value}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Dismiss button */}
              <button
                className="btn btn-ghost btn-square btn-xs flex-shrink-0"
                onClick={onDismiss}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
