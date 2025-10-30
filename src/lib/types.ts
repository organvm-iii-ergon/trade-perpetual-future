export interface User {
  id: string
  login: string
  avatarUrl: string
  email?: string
  isOwner: boolean
  referredBy?: string
}

export interface UserProfile {
  userId: string
  totalPnl: number
  totalTrades: number
  winRate: number
  totalVolume: number
  affiliateEarnings: number
  referralCount: number
  gameWins: number
  gameLosses: number
  achievements: string[]
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface Market {
  id: string
  symbol: string
  name: string
  basePrice: number
  currentPrice: number
  change24h: number
  volume24h: string
  icon: string
  high24h: number
  low24h: number
  priceHistory: PricePoint[]
}

export interface PricePoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Position {
  id: string
  userId: string
  marketId: string
  marketSymbol: string
  side: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  currentPrice: number
  liquidationPrice: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  timestamp: number
  counterpartyId?: string
}

export interface ClosedPosition extends Position {
  exitPrice: number
  realizedPnl: number
  realizedPnlPercent: number
  closedAt: number
}

export interface Order {
  id: string
  userId: string
  marketId: string
  side: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  status: 'pending' | 'matched' | 'cancelled'
  timestamp: number
}

export interface Game {
  id: string
  type: 'dice' | 'coinflip' | 'price-prediction'
  wager: number
  creatorId: string
  opponentId?: string
  status: 'waiting' | 'active' | 'completed'
  result?: GameResult
  createdAt: number
  completedAt?: number
}

export interface GameResult {
  winnerId: string
  loserId: string
  winnerPayout: number
  seed: string
  outcome: any
}

export interface Referral {
  referrerId: string
  referredId: string
  timestamp: number
  totalCommissionEarned: number
}

export interface AffiliateStats {
  userId: string
  referralCode: string
  totalReferrals: number
  activeReferrals: number
  totalCommissions: number
  lifetimeVolume: number
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatarUrl: string
  value: number
  rank: number
  change?: number
}

export interface ActivityItem {
  id: string
  type: 'trade' | 'game' | 'referral' | 'achievement'
  userId: string
  username: string
  avatarUrl: string
  description: string
  timestamp: number
  metadata?: any
}
