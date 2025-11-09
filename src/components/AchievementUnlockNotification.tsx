import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Achievement } from '@/lib/types'
import { getRarityGradient } from '@/lib/achievements'
import { X, Sparkle } from '@phosphor-icons/react'

interface AchievementUnlockNotificationProps {
  achievement: Achievement
  onDismiss: () => void
}

export function AchievementUnlockNotification({ achievement, onDismiss }: AchievementUnlockNotificationProps) {
  const rarityGradient = getRarityGradient(achievement.rarity)

  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4"
      >
        <Card className="glass-ultra border-2 border-white/30 shadow-2xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${rarityGradient} animate-shimmer`} />
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkle size={24} weight="duotone" className="text-amber animate-pulse-glow" />
                <h3 className="text-lg font-bold text-gradient-animated">
                  Achievement Unlocked!
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 rounded-full"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${rarityGradient} flex items-center justify-center text-4xl shadow-lg animate-float`}
              >
                {achievement.icon}
              </motion.div>

              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">
                  {achievement.name}
                </h4>
                <p className="text-sm text-foreground/70 mb-2">
                  {achievement.description}
                </p>
                {achievement.reward && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-long/20 text-long border border-long/30 text-sm font-semibold">
                    🎁 {achievement.reward.type === 'bonus' ? `+$${achievement.reward.value}` : achievement.reward.value}
                  </div>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 8, ease: 'linear' }}
            className={`h-1 bg-gradient-to-r ${rarityGradient} origin-left`}
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
