import { Hono } from 'hono'
import type { Env } from '../index'
import { getCached, setCache } from '../lib/cache'
import { checkRateLimit } from '../lib/rate-limit'
import { callClaude, parseJsonResponse } from '../lib/claude'
import { sentimentPrompt, realitiesPrompt, hashtagsPrompt } from '../lib/prompts'
import { fallbackSentiment, fallbackRealities, fallbackHashtags } from '../lib/fallback'

const SENTIMENT_TTL = 900 // 15 minutes
const REALITIES_TTL = 900
const HASHTAGS_TTL = 1800 // 30 minutes

export const sentimentRoutes = new Hono<{ Bindings: Env }>()

// Rate limit middleware
sentimentRoutes.use('*', async (c, next) => {
  const wallet = c.req.header('X-Wallet-Address') ?? 'anon'
  const limit = wallet !== 'anon' ? 10 : 3
  const { allowed, remaining } = await checkRateLimit(c.env.SENTIMENT_CACHE, wallet, limit)

  if (!allowed) {
    return c.json({ error: 'Rate limit exceeded', retryAfter: 60 }, 429)
  }

  c.header('X-RateLimit-Remaining', String(remaining))
  await next()
})

// GET /api/sentiment/:symbol
sentimentRoutes.get('/:symbol', async (c) => {
  const symbol = c.req.param('symbol').toUpperCase()
  const cacheKey = `sentiment:${symbol}`

  // Check cache
  const cached = await getCached(c.env.SENTIMENT_CACHE, cacheKey)
  if (cached) return c.json(cached)

  // Try Claude API
  try {
    const raw = await callClaude(c.env.ANTHROPIC_API_KEY, sentimentPrompt(symbol))
    const parsed = parseJsonResponse<{
      score: number
      label: string
      confidence: number
      volume: number
      trend: string
    }>(raw)

    if (parsed) {
      const result = { ...parsed, lastUpdated: Date.now(), source: 'claude' as const }
      await setCache(c.env.SENTIMENT_CACHE, cacheKey, result, SENTIMENT_TTL)
      return c.json(result)
    }
  } catch (err) {
    console.error('Claude API error:', err)
  }

  // Fallback to PRNG
  const fallback = fallbackSentiment(symbol)
  await setCache(c.env.SENTIMENT_CACHE, cacheKey, fallback, SENTIMENT_TTL)
  return c.json(fallback)
})

// GET /api/sentiment/realities/:symbol
sentimentRoutes.get('/realities/:symbol', async (c) => {
  const symbol = c.req.param('symbol').toUpperCase()
  const currentPrice = parseFloat(c.req.query('price') ?? '100')
  const cacheKey = `realities:${symbol}`

  const cached = await getCached(c.env.SENTIMENT_CACHE, cacheKey)
  if (cached) return c.json(cached)

  try {
    const raw = await callClaude(c.env.ANTHROPIC_API_KEY, realitiesPrompt(symbol, currentPrice))
    const parsed = parseJsonResponse<any[]>(raw)

    if (parsed && Array.isArray(parsed) && parsed.length === 4) {
      const colors = ['oklch(0.65 0.18 145)', 'oklch(0.55 0.22 25)', 'oklch(0.70 0.12 210)', 'oklch(0.60 0.18 290)']
      const result = parsed.map((r, i) => ({
        id: `reality-${i}`,
        label: r.label,
        description: r.description,
        probability: r.probability,
        pricePoints: (r.priceProjection ?? []).map((price: number, day: number) => ({
          time: `Day ${day}`,
          price,
        })),
        sentiment: r.sentiment,
        color: colors[i],
        source: 'claude' as const,
      }))
      await setCache(c.env.SENTIMENT_CACHE, cacheKey, result, REALITIES_TTL)
      return c.json(result)
    }
  } catch (err) {
    console.error('Claude realities error:', err)
  }

  const fallback = fallbackRealities(symbol, currentPrice)
  await setCache(c.env.SENTIMENT_CACHE, cacheKey, fallback, REALITIES_TTL)
  return c.json(fallback)
})

// GET /api/sentiment/hashtags/:symbol
sentimentRoutes.get('/hashtags/:symbol', async (c) => {
  const symbol = c.req.param('symbol').toUpperCase()
  const cacheKey = `hashtags:${symbol}`

  const cached = await getCached(c.env.SENTIMENT_CACHE, cacheKey)
  if (cached) return c.json(cached)

  try {
    const raw = await callClaude(c.env.ANTHROPIC_API_KEY, hashtagsPrompt(symbol))
    const parsed = parseJsonResponse<any[]>(raw)

    if (parsed && Array.isArray(parsed)) {
      const result = parsed.map(h => ({ ...h, source: 'claude' as const }))
      await setCache(c.env.SENTIMENT_CACHE, cacheKey, result, HASHTAGS_TTL)
      return c.json(result)
    }
  } catch (err) {
    console.error('Claude hashtags error:', err)
  }

  const fallback = fallbackHashtags(symbol)
  await setCache(c.env.SENTIMENT_CACHE, cacheKey, fallback, HASHTAGS_TTL)
  return c.json(fallback)
})
