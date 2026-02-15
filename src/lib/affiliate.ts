import type { UserProfile, AffiliateStats } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE || ''

// ─── Pure functions (unchanged) ──────────────────────────────────

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

// ─── API-backed functions ────────────────────────────────────────

export async function registerAffiliate(
  walletAddress: string,
  referredBy?: string,
): Promise<AffiliateStats | null> {
  if (!API_BASE) return null

  try {
    const res = await fetch(`${API_BASE}/api/affiliate/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Wallet-Address': walletAddress,
      },
      body: JSON.stringify({ walletAddress, referredBy }),
    })
    if (res.ok) {
      const data = await res.json()
      return {
        referralCode: data.referralCode,
        totalReferrals: data.stats?.totalReferrals ?? 0,
        activeReferrals: data.stats?.activeReferrals ?? 0,
        totalEarnings: data.stats?.totalEarnings ?? 0,
        totalCommissions: data.stats?.totalCommissions ?? 0,
        earningsThisMonth: data.stats?.earningsThisMonth ?? 0,
        lifetimeVolume: data.stats?.lifetimeVolume ?? 0,
        conversionRate: data.stats?.conversionRate ?? 0,
      }
    }
  } catch {
    // fall through
  }
  return null
}

export async function getAffiliateStats(walletAddress: string): Promise<AffiliateStats | null> {
  if (!API_BASE) return null

  try {
    const res = await fetch(`${API_BASE}/api/affiliate/stats/${encodeURIComponent(walletAddress)}`, {
      headers: { 'X-Wallet-Address': walletAddress },
    })
    if (res.ok) return await res.json()
  } catch {
    // fall through
  }
  return null
}

export async function trackTrade(
  walletAddress: string,
  volume: number,
  fee: number,
  txSignature: string,
): Promise<boolean> {
  if (!API_BASE) return false

  try {
    const res = await fetch(`${API_BASE}/api/affiliate/track-trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Wallet-Address': walletAddress,
      },
      body: JSON.stringify({ walletAddress, volume, fee, txSignature }),
    })
    return res.ok
  } catch {
    return false
  }
}
