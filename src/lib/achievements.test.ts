import { describe, it, expect } from 'vitest'
import { initializeAchievements, checkAchievements, ACHIEVEMENTS_DEFINITIONS } from './achievements'
import type { UserProfile, Position, Game } from '@/types'

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

describe('initializeAchievements', () => {
  it('returns all achievement definitions', () => {
    const achievements = initializeAchievements()
    expect(achievements.length).toBe(ACHIEVEMENTS_DEFINITIONS.length)
  })

  it('all achievements start unlocked=false, progress=0', () => {
    const achievements = initializeAchievements()
    for (const a of achievements) {
      expect(a.unlocked).toBe(false)
      expect(a.progress).toBe(0)
    }
  })

  it('preserves all definition fields', () => {
    const achievements = initializeAchievements()
    for (const a of achievements) {
      expect(a.id).toBeDefined()
      expect(a.category).toBeDefined()
      expect(a.name).toBeDefined()
      expect(a.target).toBeGreaterThan(0)
    }
  })
})

describe('checkAchievements', () => {
  it('auto-unlocks early-adopter', () => {
    const achievements = initializeAchievements()
    const { newlyUnlocked } = checkAchievements(achievements, makeProfile(), [], [])
    const earlyAdopter = newlyUnlocked.find(a => a.id === 'early-adopter')
    expect(earlyAdopter).toBeDefined()
    expect(earlyAdopter!.unlocked).toBe(true)
  })

  it('unlocks balance-5k when balance >= 5000', () => {
    const achievements = initializeAchievements()
    const { achievements: updated } = checkAchievements(
      achievements, makeProfile({ balance: 5000 }), [], []
    )
    const bal5k = updated.find(a => a.id === 'balance-5k')
    expect(bal5k!.unlocked).toBe(true)
  })

  it('does not unlock balance-25k when balance < 25000', () => {
    const achievements = initializeAchievements()
    const { achievements: updated } = checkAchievements(
      achievements, makeProfile({ balance: 5000 }), [], []
    )
    const bal25k = updated.find(a => a.id === 'balance-25k')
    expect(bal25k!.unlocked).toBe(false)
  })

  it('does not re-unlock already unlocked achievements', () => {
    const achievements = initializeAchievements().map(a =>
      a.id === 'early-adopter' ? { ...a, unlocked: true, unlockedAt: 1000 } : a
    )
    const { newlyUnlocked } = checkAchievements(achievements, makeProfile(), [], [])
    const earlyAdopter = newlyUnlocked.find(a => a.id === 'early-adopter')
    expect(earlyAdopter).toBeUndefined()
  })

  it('unlocks volume achievements based on totalVolume', () => {
    const achievements = initializeAchievements()
    const { achievements: updated } = checkAchievements(
      achievements, makeProfile({ totalVolume: 1500 }), [], []
    )
    expect(updated.find(a => a.id === 'volume-1k')!.unlocked).toBe(true)
    expect(updated.find(a => a.id === 'volume-10k')!.unlocked).toBe(false)
  })
})
