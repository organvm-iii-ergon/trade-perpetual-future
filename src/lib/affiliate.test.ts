import { describe, it, expect } from 'vitest'
import { generateReferralCode, calculateCommission, getUserTier, AFFILIATE_COMMISSION_RATE } from './affiliate'
import type { UserProfile } from '@/types'

const makeProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  userId: 'test-user',
  balance: 10000,
  totalVolume: 0,
  totalPnl: 0,
  winRate: 50,
  affiliateEarnings: 0,
  referralCode: 'TEST1234',
  ...overrides,
})

describe('generateReferralCode', () => {
  it('is deterministic for same userId', () => {
    expect(generateReferralCode('alice')).toBe(generateReferralCode('alice'))
  })

  it('returns uppercase string', () => {
    const code = generateReferralCode('test-user')
    expect(code).toBe(code.toUpperCase())
  })

  it('returns max 8 characters', () => {
    const code = generateReferralCode('some-very-long-user-id-string')
    expect(code.length).toBeLessThanOrEqual(8)
  })

  it('produces different codes for different users', () => {
    const codes = new Set(['alice', 'bob', 'charlie', 'dave'].map(generateReferralCode))
    expect(codes.size).toBeGreaterThan(1)
  })
})

describe('calculateCommission', () => {
  it('applies 15% commission rate', () => {
    expect(calculateCommission(100)).toBe(100 * AFFILIATE_COMMISSION_RATE)
  })

  it('returns 0 for 0 fee', () => {
    expect(calculateCommission(0)).toBe(0)
  })
})

describe('getUserTier', () => {
  it('returns bronze for low values', () => {
    expect(getUserTier(makeProfile({ totalVolume: 0, affiliateEarnings: 0 }))).toBe('bronze')
  })

  it('returns silver at 10k', () => {
    expect(getUserTier(makeProfile({ totalVolume: 10000, affiliateEarnings: 0 }))).toBe('silver')
  })

  it('returns gold at 100k', () => {
    expect(getUserTier(makeProfile({ totalVolume: 100000, affiliateEarnings: 0 }))).toBe('gold')
  })

  it('returns platinum at 1M', () => {
    expect(getUserTier(makeProfile({ totalVolume: 1000000, affiliateEarnings: 0 }))).toBe('platinum')
  })

  it('combines totalVolume and affiliateEarnings', () => {
    expect(getUserTier(makeProfile({ totalVolume: 50000, affiliateEarnings: 50000 }))).toBe('gold')
  })
})
