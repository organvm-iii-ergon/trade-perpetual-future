import type { User, UserProfile } from './types'

export function generateReferralCode(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase()
}

export const AFFILIATE_COMMISSION_RATE = 0.15

export function calculateCommission(tradeFee: number): number {
  return tradeFee * AFFILIATE_COMMISSION_RATE
}

export function getUserTier(profile: UserProfile): 'bronze' | 'silver' | 'gold' | 'platinum' {
  const totalValue = profile.totalVolume + profile.affiliateEarnings
  if (totalValue >= 1000000) return 'platinum'
  if (totalValue >= 100000) return 'gold'
  if (totalValue >= 10000) return 'silver'
  return 'bronze'
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'platinum': return 'text-blue-300'
    case 'gold': return 'text-yellow-500'
    case 'silver': return 'text-gray-400'
    default: return 'text-amber-700'
  }
}

export function getTierIcon(tier: string): string {
  switch (tier) {
    case 'platinum': return '💎'
    case 'gold': return '👑'
    case 'silver': return '⭐'
    default: return '🥉'
  }
}
