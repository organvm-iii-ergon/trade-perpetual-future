import { Hono } from 'hono'
import type { Env } from '../index'
import { getCached, setCache } from '../lib/cache'
import { checkRateLimit } from '../lib/rate-limit'

interface AffiliateRecord {
  walletAddress: string
  referralCode: string
  referredBy: string | null
  createdAt: number
  stats: {
    totalReferrals: number
    activeReferrals: number
    totalEarnings: number
    totalCommissions: number
    earningsThisMonth: number
    lifetimeVolume: number
    conversionRate: number
    trades: number
  }
}

const COMMISSION_RATE = 0.15

function generateCode(wallet: string): string {
  let hash = 0
  for (let i = 0; i < wallet.length; i++) {
    hash = wallet.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase()
}

export const affiliateRoutes = new Hono<{ Bindings: Env }>()

// Rate limit
affiliateRoutes.use('*', async (c, next) => {
  const wallet = c.req.header('X-Wallet-Address') ?? 'anon'
  const { allowed } = await checkRateLimit(c.env.AFFILIATE_KV, wallet, 20)
  if (!allowed) return c.json({ error: 'Rate limit exceeded' }, 429)
  await next()
})

// POST /api/affiliate/register
affiliateRoutes.post('/register', async (c) => {
  const body = await c.req.json<{ walletAddress: string; referredBy?: string }>()
  const { walletAddress, referredBy } = body

  if (!walletAddress) return c.json({ error: 'walletAddress required' }, 400)

  // Check if already registered
  const existing = await getCached<AffiliateRecord>(c.env.AFFILIATE_KV, `wallet:${walletAddress}`)
  if (existing) return c.json(existing)

  const referralCode = generateCode(walletAddress)

  // Resolve referrer
  let referrerWallet: string | null = null
  if (referredBy) {
    const referrer = await getCached<{ walletAddress: string }>(c.env.AFFILIATE_KV, `referral:${referredBy}`)
    if (referrer) {
      referrerWallet = referrer.walletAddress
      // Increment referrer's stats
      const referrerRecord = await getCached<AffiliateRecord>(c.env.AFFILIATE_KV, `wallet:${referrer.walletAddress}`)
      if (referrerRecord) {
        referrerRecord.stats.totalReferrals++
        referrerRecord.stats.activeReferrals++
        await setCache(c.env.AFFILIATE_KV, `wallet:${referrer.walletAddress}`, referrerRecord, 0)
      }
    }
  }

  const record: AffiliateRecord = {
    walletAddress,
    referralCode,
    referredBy: referrerWallet,
    createdAt: Date.now(),
    stats: {
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
      totalCommissions: 0,
      earningsThisMonth: 0,
      lifetimeVolume: 0,
      conversionRate: 0,
      trades: 0,
    },
  }

  // Store both wallet->record and code->wallet mappings
  await setCache(c.env.AFFILIATE_KV, `wallet:${walletAddress}`, record, 0)
  await setCache(c.env.AFFILIATE_KV, `referral:${referralCode}`, { walletAddress, createdAt: Date.now() }, 0)

  return c.json(record, 201)
})

// GET /api/affiliate/stats/:wallet
affiliateRoutes.get('/stats/:wallet', async (c) => {
  const wallet = c.req.param('wallet')
  const record = await getCached<AffiliateRecord>(c.env.AFFILIATE_KV, `wallet:${wallet}`)
  if (!record) return c.json({ error: 'Not registered' }, 404)
  return c.json(record.stats)
})

// POST /api/affiliate/track-trade
affiliateRoutes.post('/track-trade', async (c) => {
  const body = await c.req.json<{
    walletAddress: string
    volume: number
    fee: number
    txSignature: string
  }>()

  const { walletAddress, volume, fee } = body
  if (!walletAddress || !volume) return c.json({ error: 'Missing fields' }, 400)

  const record = await getCached<AffiliateRecord>(c.env.AFFILIATE_KV, `wallet:${walletAddress}`)
  if (!record) return c.json({ error: 'Not registered' }, 404)

  record.stats.lifetimeVolume += volume
  record.stats.trades++

  // Credit referrer commission
  if (record.referredBy) {
    const referrer = await getCached<AffiliateRecord>(c.env.AFFILIATE_KV, `wallet:${record.referredBy}`)
    if (referrer) {
      const commission = fee * COMMISSION_RATE
      referrer.stats.totalCommissions += commission
      referrer.stats.totalEarnings += commission
      referrer.stats.earningsThisMonth += commission
      referrer.stats.conversionRate = referrer.stats.totalReferrals > 0
        ? (referrer.stats.activeReferrals / referrer.stats.totalReferrals) * 100
        : 0
      await setCache(c.env.AFFILIATE_KV, `wallet:${record.referredBy}`, referrer, 0)
    }
  }

  await setCache(c.env.AFFILIATE_KV, `wallet:${walletAddress}`, record, 0)
  return c.json({ success: true, stats: record.stats })
})

// GET /api/affiliate/leaderboard
affiliateRoutes.get('/leaderboard', async (c) => {
  // KV doesn't support listing by value, so we use a cached leaderboard
  const cached = await getCached<any[]>(c.env.AFFILIATE_KV, 'leaderboard:top50')
  if (cached) return c.json(cached)

  // Return empty until leaderboard is built by a scheduled worker
  return c.json([])
})
