import type { SentimentData, Reality, HashtagTrend, Alert } from '@/types'

/** Simple hash for deterministic pseudo-random values per symbol */
function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

export async function analyzeSentiment(symbol: string): Promise<SentimentData> {
  // Simulated sentiment — seeded by symbol + hour for slow drift
  const hourSeed = hashCode(symbol) + Math.floor(Date.now() / 3_600_000)
  const rng = seededRandom(hourSeed)

  const score = Math.round((rng() * 200 - 100))
  const confidence = Math.round(40 + rng() * 55)
  const volume = Math.round(20 + rng() * 75)

  let label: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral'
  if (score > 20) label = 'Bullish'
  else if (score < -20) label = 'Bearish'

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (score > 40 || volume > 70) trend = 'up'
  else if (score < -40 || volume < 30) trend = 'down'

  return { score, label, confidence, volume, trend, lastUpdated: Date.now() }
}

export async function generateRealities(
  symbol: string,
  currentPrice: number,
  sentiment: SentimentData
): Promise<Reality[]> {
  const seed = hashCode(symbol + String(Math.floor(Date.now() / 3_600_000)))
  const rng = seededRandom(seed)

  const templates = [
    { label: 'Bull Rally', sentiment: 'bullish' as const, drift: 0.03 },
    { label: 'Bear Correction', sentiment: 'bearish' as const, drift: -0.04 },
    { label: 'Sideways Consolidation', sentiment: 'neutral' as const, drift: 0.002 },
    { label: 'High Volatility', sentiment: 'volatile' as const, drift: 0.01 },
  ]

  const colors = [
    'oklch(0.65 0.18 145)',
    'oklch(0.55 0.22 25)',
    'oklch(0.70 0.12 210)',
    'oklch(0.60 0.18 290)',
  ]

  // Distribute probability with bias toward sentiment direction
  const rawProbs = templates.map(() => 10 + rng() * 40)
  const sum = rawProbs.reduce((a, b) => a + b, 0)
  const probabilities = rawProbs.map((p) => Math.round((p / sum) * 100))
  // Ensure they sum to 100
  probabilities[0] += 100 - probabilities.reduce((a, b) => a + b, 0)

  return templates.map((t, i) => {
    const points = Array.from({ length: 7 }, (_, day) => {
      const noise = (rng() - 0.5) * 0.02
      const price = currentPrice * (1 + t.drift * day + noise * day)
      return { time: `Day ${day}`, price: Math.round(price * 100) / 100 }
    })

    return {
      id: `reality-${i}`,
      label: t.label,
      description: `${t.label} scenario for ${symbol} based on ${sentiment.label.toLowerCase()} sentiment`,
      probability: probabilities[i],
      pricePoints: points,
      sentiment: t.sentiment,
      color: colors[i],
    }
  })
}

export async function analyzeHashtags(symbol: string): Promise<HashtagTrend[]> {
  const seed = hashCode(symbol + 'hashtags' + Math.floor(Date.now() / 3_600_000))
  const rng = seededRandom(seed)

  const tags = [
    `#${symbol}`, `#${symbol}Moon`, `#${symbol}Dip`,
    '#CryptoTrading', '#DeFi', '#PerpFutures',
    '#BullRun', '#MarketWatch', '#WhaleAlert',
  ]

  return tags.map((hashtag) => {
    const mentions = Math.round(100 + rng() * 9900)
    const sentimentVal = Math.round(rng() * 200 - 100)
    const changePercent = Math.round((rng() * 100 - 50) * 10) / 10

    let sentimentLabel: 'Positive' | 'Negative' | 'Neutral' = 'Neutral'
    if (sentimentVal > 20) sentimentLabel = 'Positive'
    else if (sentimentVal < -20) sentimentLabel = 'Negative'

    let trend: 'rising' | 'falling' | 'stable' = 'stable'
    if (changePercent > 10) trend = 'rising'
    else if (changePercent < -10) trend = 'falling'

    return { hashtag, mentions, sentiment: sentimentVal, sentimentLabel, trend, changePercent }
  })
}

export function checkForAlerts(
  symbol: string,
  sentiment: SentimentData,
  previousSentiment?: SentimentData
): Alert | null {
  if (sentiment.score < -40) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'downtrend',
      severity: sentiment.score < -60 ? 'high' : 'medium',
      message: `Strong bearish sentiment detected for ${symbol} (${sentiment.score})`,
      timestamp: Date.now(),
      dismissed: false,
    }
  }

  if (previousSentiment && sentiment.score - previousSentiment.score < -30) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'sentiment-drop',
      severity: 'high',
      message: `Rapid sentiment drop for ${symbol}: ${previousSentiment.score} → ${sentiment.score}`,
      timestamp: Date.now(),
      dismissed: false,
    }
  }

  if (sentiment.volume > 85 && Math.abs(sentiment.score) < 15) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'volatility',
      severity: 'low',
      message: `High volatility expected for ${symbol} (high volume, mixed sentiment)`,
      timestamp: Date.now(),
      dismissed: false,
    }
  }

  return null
}

export function getSentimentColor(score: number): string {
  if (score > 20) return 'text-success'
  if (score < -20) return 'text-error'
  return 'text-base-content/60'
}

export function getSentimentBgColor(score: number): string {
  if (score > 20) return 'bg-success/20'
  if (score < -20) return 'bg-error/20'
  return 'bg-base-300/20'
}
