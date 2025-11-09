import type { Achievement, UserProfile, Position, Game } from './types'

export const ACHIEVEMENTS_DEFINITIONS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-trade',
    category: 'trading',
    name: 'First Trade',
    description: 'Open your first trading position',
    icon: '🎯',
    rarity: 'common',
    target: 1,
    reward: { type: 'badge', value: 'Trader' }
  },
  {
    id: 'volume-1k',
    category: 'trading',
    name: 'Volume Trader',
    description: 'Reach $1,000 in total trading volume',
    icon: '📈',
    rarity: 'common',
    target: 1000,
    reward: { type: 'badge', value: 'Volume Trader' }
  },
  {
    id: 'volume-10k',
    category: 'trading',
    name: 'High Volume Trader',
    description: 'Reach $10,000 in total trading volume',
    icon: '💰',
    rarity: 'rare',
    target: 10000,
    reward: { type: 'badge', value: 'High Roller' }
  },
  {
    id: 'volume-100k',
    category: 'trading',
    name: 'Whale Trader',
    description: 'Reach $100,000 in total trading volume',
    icon: '🐋',
    rarity: 'epic',
    target: 100000,
    reward: { type: 'bonus', value: 100 }
  },
  {
    id: 'profit-100',
    category: 'trading',
    name: 'In The Green',
    description: 'Make $100 in total profit',
    icon: '💵',
    rarity: 'common',
    target: 100,
    reward: { type: 'badge', value: 'Profitable' }
  },
  {
    id: 'profit-1k',
    category: 'trading',
    name: 'Profit Master',
    description: 'Make $1,000 in total profit',
    icon: '💸',
    rarity: 'rare',
    target: 1000,
    reward: { type: 'bonus', value: 50 }
  },
  {
    id: 'profit-10k',
    category: 'trading',
    name: 'Trading Legend',
    description: 'Make $10,000 in total profit',
    icon: '👑',
    rarity: 'legendary',
    target: 10000,
    reward: { type: 'bonus', value: 500 }
  },
  {
    id: 'win-streak-5',
    category: 'trading',
    name: 'Hot Streak',
    description: 'Close 5 profitable trades in a row',
    icon: '🔥',
    rarity: 'rare',
    target: 5,
    reward: { type: 'badge', value: 'Streak Master' }
  },
  {
    id: 'win-streak-10',
    category: 'trading',
    name: 'Unstoppable',
    description: 'Close 10 profitable trades in a row',
    icon: '⚡',
    rarity: 'epic',
    target: 10,
    reward: { type: 'bonus', value: 150 }
  },
  {
    id: 'first-game',
    category: 'gaming',
    name: 'Game On',
    description: 'Play your first PvP game',
    icon: '🎮',
    rarity: 'common',
    target: 1,
    reward: { type: 'badge', value: 'Player' }
  },
  {
    id: 'game-win-10',
    category: 'gaming',
    name: 'Game Winner',
    description: 'Win 10 PvP games',
    icon: '🏆',
    rarity: 'rare',
    target: 10,
    reward: { type: 'badge', value: 'Game Master' }
  },
  {
    id: 'game-win-50',
    category: 'gaming',
    name: 'Gaming Legend',
    description: 'Win 50 PvP games',
    icon: '🎖️',
    rarity: 'epic',
    target: 50,
    reward: { type: 'bonus', value: 200 }
  },
  {
    id: 'dice-master',
    category: 'gaming',
    name: 'Dice Master',
    description: 'Win 5 dice games',
    icon: '🎲',
    rarity: 'rare',
    target: 5,
    reward: { type: 'badge', value: 'Dice Master' }
  },
  {
    id: 'coinflip-champion',
    category: 'gaming',
    name: 'Coinflip Champion',
    description: 'Win 5 coinflip games',
    icon: '🪙',
    rarity: 'rare',
    target: 5,
    reward: { type: 'badge', value: 'Flip Master' }
  },
  {
    id: 'high-roller',
    category: 'gaming',
    name: 'High Roller',
    description: 'Wager $1,000 or more in a single game',
    icon: '💎',
    rarity: 'epic',
    target: 1000,
    reward: { type: 'badge', value: 'High Roller' }
  },
  {
    id: 'first-referral',
    category: 'social',
    name: 'Recruiter',
    description: 'Get your first referral',
    icon: '👥',
    rarity: 'common',
    target: 1,
    reward: { type: 'bonus', value: 25 }
  },
  {
    id: 'referral-10',
    category: 'social',
    name: 'Influencer',
    description: 'Refer 10 users',
    icon: '🌟',
    rarity: 'rare',
    target: 10,
    reward: { type: 'bonus', value: 100 }
  },
  {
    id: 'referral-50',
    category: 'social',
    name: 'Network King',
    description: 'Refer 50 users',
    icon: '👸',
    rarity: 'epic',
    target: 50,
    reward: { type: 'bonus', value: 500 }
  },
  {
    id: 'affiliate-earnings-100',
    category: 'social',
    name: 'Earning Affiliate',
    description: 'Earn $100 from affiliate commissions',
    icon: '💰',
    rarity: 'rare',
    target: 100,
    reward: { type: 'badge', value: 'Affiliate Pro' }
  },
  {
    id: 'early-adopter',
    category: 'milestone',
    name: 'Early Adopter',
    description: 'Join Bang Perp Exchange',
    icon: '🚀',
    rarity: 'common',
    target: 1,
    reward: { type: 'badge', value: 'Early Adopter' }
  },
  {
    id: 'balance-5k',
    category: 'milestone',
    name: 'Loaded',
    description: 'Reach a balance of $5,000',
    icon: '💵',
    rarity: 'rare',
    target: 5000,
    reward: { type: 'bonus', value: 100 }
  },
  {
    id: 'balance-25k',
    category: 'milestone',
    name: 'Wealthy',
    description: 'Reach a balance of $25,000',
    icon: '💰',
    rarity: 'epic',
    target: 25000,
    reward: { type: 'bonus', value: 500 }
  },
  {
    id: 'balance-100k',
    category: 'milestone',
    name: 'Millionaire Track',
    description: 'Reach a balance of $100,000',
    icon: '🏆',
    rarity: 'legendary',
    target: 100000,
    reward: { type: 'bonus', value: 2000 }
  }
]

export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS_DEFINITIONS.map(def => ({
    ...def,
    progress: 0,
    unlocked: false
  }))
}

export function checkAchievements(
  achievements: Achievement[],
  profile: UserProfile,
  positions: Position[],
  games: Game[]
): { achievements: Achievement[], newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = []
  const totalClosedPositions = positions.filter(p => p.pnl !== 0).length
  const profitablePositions = positions.filter(p => p.pnl > 0).length
  const completedGames = games.filter(g => g.status === 'completed')
  const wonGames = completedGames.filter(g => g.result?.winnerId === profile.userId)
  const wonDiceGames = wonGames.filter(g => g.type === 'dice').length
  const wonCoinflipGames = wonGames.filter(g => g.type === 'coinflip').length
  const maxWager = Math.max(...games.map(g => g.wager), 0)

  const updatedAchievements = achievements.map(achievement => {
    if (achievement.unlocked) return achievement

    let currentProgress = 0

    switch (achievement.id) {
      case 'early-adopter':
        currentProgress = 1
        break
      case 'first-trade':
        currentProgress = totalClosedPositions
        break
      case 'volume-1k':
      case 'volume-10k':
      case 'volume-100k':
        currentProgress = profile.totalVolume
        break
      case 'profit-100':
      case 'profit-1k':
      case 'profit-10k':
        currentProgress = Math.max(0, profile.totalPnl)
        break
      case 'win-streak-5':
      case 'win-streak-10':
        currentProgress = profitablePositions
        break
      case 'first-game':
        currentProgress = completedGames.length
        break
      case 'game-win-10':
      case 'game-win-50':
        currentProgress = wonGames.length
        break
      case 'dice-master':
        currentProgress = wonDiceGames
        break
      case 'coinflip-champion':
        currentProgress = wonCoinflipGames
        break
      case 'high-roller':
        currentProgress = maxWager
        break
      case 'affiliate-earnings-100':
        currentProgress = profile.affiliateEarnings
        break
      case 'balance-5k':
      case 'balance-25k':
      case 'balance-100k':
        currentProgress = profile.balance
        break
    }

    const unlocked = currentProgress >= achievement.target
    
    if (unlocked && !achievement.unlocked) {
      const unlockedAchievement = {
        ...achievement,
        progress: currentProgress,
        unlocked: true,
        unlockedAt: Date.now()
      }
      newlyUnlocked.push(unlockedAchievement)
      return unlockedAchievement
    }

    return {
      ...achievement,
      progress: currentProgress
    }
  })

  return { achievements: updatedAchievements, newlyUnlocked }
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'text-foreground/70'
    case 'rare':
      return 'text-cyan'
    case 'epic':
      return 'text-ai-purple'
    case 'legendary':
      return 'text-amber'
    default:
      return 'text-foreground'
  }
}

export function getRarityGradient(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'from-gray-500 to-gray-600'
    case 'rare':
      return 'from-cyan to-blue-500'
    case 'epic':
      return 'from-ai-purple to-magenta'
    case 'legendary':
      return 'from-amber to-orange'
    default:
      return 'from-gray-500 to-gray-600'
  }
}
