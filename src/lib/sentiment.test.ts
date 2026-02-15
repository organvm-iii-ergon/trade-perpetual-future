import { describe, it, expect } from 'vitest'
import { analyzeSentiment, analyzeSentimentLocal, generateRealities, generateRealitiesLocal, checkForAlerts } from './sentiment'

describe('analyzeSentiment', () => {
  it('returns a score between -100 and 100', async () => {
    const result = await analyzeSentiment('SOL')
    expect(result.score).toBeGreaterThanOrEqual(-100)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('returns confidence between 40 and 95', async () => {
    const result = await analyzeSentiment('BTC')
    expect(result.confidence).toBeGreaterThanOrEqual(40)
    expect(result.confidence).toBeLessThanOrEqual(95)
  })

  it('returns valid label', async () => {
    const result = await analyzeSentiment('ETH')
    expect(['Bullish', 'Bearish', 'Neutral']).toContain(result.label)
  })

  it('returns valid trend', async () => {
    const result = await analyzeSentiment('DOGE')
    expect(['up', 'down', 'stable']).toContain(result.trend)
  })

  it('is deterministic within the same hour', async () => {
    const a = await analyzeSentiment('SOL')
    const b = await analyzeSentiment('SOL')
    expect(a.score).toBe(b.score)
  })
})

describe('generateRealities', () => {
  it('returns exactly 4 realities', async () => {
    const sentiment = await analyzeSentiment('SOL')
    const realities = await generateRealities('SOL', 125, sentiment)
    expect(realities).toHaveLength(4)
  })

  it('probabilities sum to 100', async () => {
    const sentiment = await analyzeSentiment('BTC')
    const realities = await generateRealities('BTC', 67000, sentiment)
    const sum = realities.reduce((acc, r) => acc + r.probability, 0)
    expect(sum).toBe(100)
  })

  it('each reality has 7 price points', async () => {
    const sentiment = await analyzeSentiment('ETH')
    const realities = await generateRealities('ETH', 3400, sentiment)
    for (const r of realities) {
      expect(r.pricePoints).toHaveLength(7)
    }
  })
})

describe('checkForAlerts', () => {
  it('returns downtrend alert for very negative sentiment', () => {
    const alert = checkForAlerts('SOL', {
      score: -50, label: 'Bearish', confidence: 80, volume: 60, trend: 'down', lastUpdated: Date.now()
    })
    expect(alert).not.toBeNull()
    expect(alert!.type).toBe('downtrend')
  })

  it('returns sentiment-drop alert for rapid decline', () => {
    const previous = { score: 50, label: 'Bullish' as const, confidence: 80, volume: 60, trend: 'up' as const, lastUpdated: Date.now() - 3600000 }
    const current = { score: 10, label: 'Neutral' as const, confidence: 60, volume: 50, trend: 'down' as const, lastUpdated: Date.now() }
    const alert = checkForAlerts('BTC', current, previous)
    expect(alert).not.toBeNull()
    expect(alert!.type).toBe('sentiment-drop')
  })

  it('returns null for normal sentiment', () => {
    const alert = checkForAlerts('ETH', {
      score: 30, label: 'Bullish', confidence: 70, volume: 50, trend: 'up', lastUpdated: Date.now()
    })
    expect(alert).toBeNull()
  })

  it('returns volatility alert for high volume mixed sentiment', () => {
    const alert = checkForAlerts('DOGE', {
      score: 5, label: 'Neutral', confidence: 60, volume: 90, trend: 'stable', lastUpdated: Date.now()
    })
    expect(alert).not.toBeNull()
    expect(alert!.type).toBe('volatility')
  })
})
