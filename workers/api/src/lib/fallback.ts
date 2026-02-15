/** PRNG sentiment fallback — ported from client-side sentiment.ts */

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

export function fallbackSentiment(symbol: string) {
  const hourSeed = hashCode(symbol) + Math.floor(Date.now() / 3_600_000)
  const rng = seededRandom(hourSeed)

  const score = Math.round(rng() * 200 - 100)
  const confidence = Math.round(40 + rng() * 55)
  const volume = Math.round(20 + rng() * 75)

  let label: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral'
  if (score > 20) label = 'Bullish'
  else if (score < -20) label = 'Bearish'

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (score > 40 || volume > 70) trend = 'up'
  else if (score < -40 || volume < 30) trend = 'down'

  return { score, label, confidence, volume, trend, lastUpdated: Date.now(), source: 'fallback' as const }
}

export function fallbackRealities(symbol: string, currentPrice: number) {
  const seed = hashCode(symbol + String(Math.floor(Date.now() / 3_600_000)))
  const rng = seededRandom(seed)

  const templates = [
    { label: 'Bull Rally', sentiment: 'bullish' as const, drift: 0.03 },
    { label: 'Bear Correction', sentiment: 'bearish' as const, drift: -0.04 },
    { label: 'Sideways Consolidation', sentiment: 'neutral' as const, drift: 0.002 },
    { label: 'High Volatility', sentiment: 'volatile' as const, drift: 0.01 },
  ]

  const colors = ['oklch(0.65 0.18 145)', 'oklch(0.55 0.22 25)', 'oklch(0.70 0.12 210)', 'oklch(0.60 0.18 290)']
  const rawProbs = templates.map(() => 10 + rng() * 40)
  const sum = rawProbs.reduce((a, b) => a + b, 0)
  const probabilities = rawProbs.map(p => Math.round((p / sum) * 100))
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
      description: `${t.label} scenario for ${symbol}`,
      probability: probabilities[i],
      pricePoints: points,
      sentiment: t.sentiment,
      color: colors[i],
      source: 'fallback' as const,
    }
  })
}

export function fallbackHashtags(symbol: string) {
  const seed = hashCode(symbol + 'hashtags' + Math.floor(Date.now() / 3_600_000))
  const rng = seededRandom(seed)

  const tags = [
    `#${symbol}`, `#${symbol}Moon`, `#${symbol}Dip`,
    '#CryptoTrading', '#DeFi', '#PerpFutures',
    '#BullRun', '#MarketWatch', '#WhaleAlert',
  ]

  return tags.map(hashtag => {
    const mentions = Math.round(100 + rng() * 9900)
    const sentimentVal = Math.round(rng() * 200 - 100)
    const changePercent = Math.round((rng() * 100 - 50) * 10) / 10
    let sentimentLabel: 'Positive' | 'Negative' | 'Neutral' = 'Neutral'
    if (sentimentVal > 20) sentimentLabel = 'Positive'
    else if (sentimentVal < -20) sentimentLabel = 'Negative'
    let trend: 'rising' | 'falling' | 'stable' = 'stable'
    if (changePercent > 10) trend = 'rising'
    else if (changePercent < -10) trend = 'falling'

    return { hashtag, mentions, sentiment: sentimentVal, sentimentLabel, trend, changePercent, source: 'fallback' as const }
  })
}
