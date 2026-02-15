import { describe, it, expect } from 'vitest'
import { rollDice, flipCoin, predictPrice, verifyGameResult, calculateGamePayout, GAME_FEE_PERCENT } from './game-logic'

describe('rollDice', () => {
  it('returns a number between 1 and 6', () => {
    const seeds = ['test1', 'test2', 'abc', 'xyz', 'hello']
    for (const seed of seeds) {
      const result = rollDice(seed)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    }
  })

  it('is deterministic for the same seed', () => {
    expect(rollDice('deterministic')).toBe(rollDice('deterministic'))
  })

  it('produces different results for different seeds', () => {
    const results = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(rollDice))
    expect(results.size).toBeGreaterThan(1)
  })
})

describe('flipCoin', () => {
  it('returns heads or tails', () => {
    const result = flipCoin('test')
    expect(['heads', 'tails']).toContain(result)
  })

  it('is deterministic for the same seed', () => {
    expect(flipCoin('coin-seed')).toBe(flipCoin('coin-seed'))
  })
})

describe('predictPrice', () => {
  it('returns predicted and actual prices', () => {
    const result = predictPrice('seed', 100)
    expect(result).toHaveProperty('predicted')
    expect(result).toHaveProperty('actual')
    expect(result.predicted).toBe(100)
  })

  it('actual price stays within volatility band', () => {
    const basePrice = 1000
    const result = predictPrice('any-seed', basePrice)
    // hash-based change is ((hash % 1000) / 1000 - 0.5) * 2 * 0.02 → max ±2% but modulo can exceed
    expect(result.actual).toBeGreaterThan(basePrice * 0.95)
    expect(result.actual).toBeLessThan(basePrice * 1.05)
  })
})

describe('verifyGameResult', () => {
  it('verifies dice results', () => {
    const seed = 'verify-dice'
    const expected = rollDice(seed)
    expect(verifyGameResult(seed, 'dice', expected)).toBe(true)
    expect(verifyGameResult(seed, 'dice', expected === 1 ? 2 : 1)).toBe(false)
  })

  it('verifies coinflip results', () => {
    const seed = 'verify-coin'
    const expected = flipCoin(seed)
    expect(verifyGameResult(seed, 'coinflip', expected)).toBe(true)
  })

  it('returns true for unknown game types', () => {
    expect(verifyGameResult('seed', 'unknown', 'anything')).toBe(true)
  })
})

describe('calculateGamePayout', () => {
  it('applies 2% fee to pot by default', () => {
    const wager = 100
    const pot = wager * 2
    const fee = pot * GAME_FEE_PERCENT
    expect(calculateGamePayout(wager)).toBe(pot - fee)
  })

  it('uses custom fee when provided', () => {
    expect(calculateGamePayout(100, 0.05)).toBe(190)
  })

  it('returns full pot with zero fee', () => {
    expect(calculateGamePayout(100, 0)).toBe(200)
  })
})
