import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  TrendingUp,
  Dice3,
  Share2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AchievementCard } from './AchievementCard'
import type { Achievement } from '@/types'

type AchievementCategory = 'all' | 'trading' | 'gaming' | 'social' | 'milestone'

interface AchievementsTabProps {
  achievements: Achievement[]
  totalUnlocked: number
}

const categoryConfig: {
  id: AchievementCategory
  label: string
  icon: React.ReactNode
}[] = [
  { id: 'all', label: 'All', icon: <Sparkles size={14} /> },
  { id: 'trading', label: 'Trading', icon: <TrendingUp size={14} /> },
  { id: 'gaming', label: 'Gaming', icon: <Dice3 size={14} /> },
  { id: 'social', label: 'Social', icon: <Share2 size={14} /> },
  { id: 'milestone', label: 'Milestones', icon: <Trophy size={14} /> },
]

export function AchievementsTab({ achievements, totalUnlocked }: AchievementsTabProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  const filteredAchievements = useMemo(() => {
    let filtered = achievements
    if (activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category === activeCategory)
    }
    if (showUnlockedOnly) {
      filtered = filtered.filter(a => a.unlocked)
    }
    // Sort: unlocked first, then by progress
    return filtered.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1
      if (!a.unlocked && b.unlocked) return 1
      return (b.progress / b.target) - (a.progress / a.target)
    })
  }, [achievements, activeCategory, showUnlockedOnly])

  const totalInCategory = activeCategory === 'all'
    ? achievements.length
    : achievements.filter(a => a.category === activeCategory).length

  const unlockedInCategory = activeCategory === 'all'
    ? totalUnlocked
    : achievements.filter(a => a.category === activeCategory && a.unlocked).length

  const progressPercent = totalInCategory > 0
    ? (unlockedInCategory / totalInCategory) * 100
    : 0

  return (
    <motion.div
      className="space-y-6 p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header stats */}
      <div className="card bg-base-200 glass-strong p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber/10">
              <Trophy size={20} className="text-amber" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-base-content">Achievements</h2>
              <p className="text-xs text-base-content/60">
                {totalUnlocked} of {achievements.length} unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-amber">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
        </div>
        <progress
          className="progress progress-warning w-full"
          value={progressPercent}
          max={100}
        />
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <div role="tablist" className="tabs tabs-boxed bg-base-300/50 flex-1">
          {categoryConfig.map(cat => (
            <button
              key={cat.id}
              role="tab"
              className={cn(
                'tab gap-1.5 text-xs',
                activeCategory === cat.id && 'tab-active'
              )}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>

        <label className="label cursor-pointer gap-2">
          <span className="label-text text-xs">Unlocked only</span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-accent"
            checked={showUnlockedOnly}
            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
          />
        </label>
      </div>

      {/* Category summary */}
      <div className="flex items-center justify-between text-sm text-base-content/60">
        <span>
          {unlockedInCategory} / {totalInCategory} unlocked
        </span>
        <span className="text-xs">
          {filteredAchievements.length} showing
        </span>
      </div>

      {/* Achievement grid */}
      <AnimatePresence mode="popLayout">
        {filteredAchievements.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {filteredAchievements.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy size={32} className="mx-auto text-base-content/30 mb-3" />
            <p className="text-base-content/60 text-sm">No achievements to show</p>
            <p className="text-base-content/40 text-xs mt-1">
              {showUnlockedOnly
                ? 'Try disabling the "Unlocked only" filter'
                : 'Keep playing to unlock achievements'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
