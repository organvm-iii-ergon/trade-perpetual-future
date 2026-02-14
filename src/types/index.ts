// Unified type definitions merging archive + production types

export interface Symbol {
  ticker: string
  name: string
  currentPrice: number
  sentiment: SentimentData
}

export interface SentimentData {
  score: number
  label: 'Bullish' | 'Bearish' | 'Neutral'
  confidence: number
  volume: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: number
}

export interface Reality {
  id: string
  label: string
  description: string
  probability: number
  pricePoints: PricePoint[]
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'volatile'
  color: string
}

export interface PricePoint {
  time: string | number
  price: number
  timestamp?: number
  close?: number
  open?: number
  high?: number
  low?: number
  volume?: number
}

export interface HashtagTrend {
  hashtag: string
  mentions: number
  sentiment: number
  sentimentLabel: 'Positive' | 'Negative' | 'Neutral'
  trend: 'rising' | 'falling' | 'stable'
  changePercent: number
}

export interface Alert {
  id: string
  symbol: string
  type: 'downtrend' | 'sentiment-drop' | 'volatility'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: number
  dismissed: boolean
}

export interface SimMarket {
  symbol: string
  name: string
  currentPrice: number
  change24h: number
  volume24h: number
  openInterest: number
  fundingRate: number
  high24h: number
  low24h: number
  basePrice: number
  icon?: string
  priceHistory: PricePoint[]
}

export interface Position {
  id: string
  symbol: string
  marketSymbol: string
  side: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  currentPrice: number
  liquidationPrice: number
  pnl: number
  pnlPercent: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  timestamp: number
}

export interface Game {
  id: string
  type: 'dice' | 'coinflip' | 'price-prediction'
  wager: number
  creatorId: string
  opponentId?: string
  status: 'waiting' | 'active' | 'completed'
  createdAt: number
  result?: GameResult
}

export interface GameResult {
  winnerId: string
  outcome: any
  timestamp: number
}

export interface UserProfile {
  userId: string
  balance: number
  totalVolume: number
  totalPnl: number
  winRate: number
  affiliateEarnings: number
  referralCode: string
  referredBy?: string
}

export interface AffiliateStats {
  referralCode: string
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  totalCommissions: number
  earningsThisMonth: number
  lifetimeVolume: number
  conversionRate: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  totalVolume: number
  totalPnl: number
  winRate: number
  value: number
  change?: number
  avatarUrl?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface VisualTheme {
  id: string
  name: string
  description: string
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    border: string
    gradientStart: string
    gradientMid: string
    gradientEnd: string
  }
}

export interface PersonalizationPreset {
  id: 'quick' | 'balanced' | 'maximum'
  name: string
  description: string
  settings: {
    particlesEnabled: boolean
    particleIntensity: number
    glassIntensity: number
    animationSpeed: number
    backgroundIntensity: number
  }
}

export interface Achievement {
  id: string
  category: 'trading' | 'gaming' | 'social' | 'milestone'
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  target: number
  unlocked: boolean
  unlockedAt?: number
  reward?: {
    type: 'badge' | 'title' | 'bonus'
    value: string | number
  }
}

export interface UserAchievements {
  achievements: Achievement[]
  totalUnlocked: number
  lastUnlocked?: Achievement
}
