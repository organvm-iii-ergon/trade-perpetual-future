export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function rollDice(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 6) + 1
}

export function flipCoin(seed: string): 'heads' | 'tails' {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash % 2 === 0 ? 'heads' : 'tails'
}

export function predictPrice(seed: string, currentPrice: number): { predicted: number; actual: number } {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const volatility = 0.02
  const change = ((hash % 1000) / 1000 - 0.5) * 2 * volatility
  return {
    predicted: currentPrice,
    actual: currentPrice * (1 + change)
  }
}

export function verifyGameResult(seed: string, gameType: string, result: any): boolean {
  switch (gameType) {
    case 'dice':
      return rollDice(seed) === result
    case 'coinflip':
      return flipCoin(seed) === result
    default:
      return true
  }
}

export const GAME_FEE_PERCENT = 0.02

export function calculateGamePayout(wager: number, fee: number = GAME_FEE_PERCENT): number {
  const pot = wager * 2
  const feeAmount = pot * fee
  return pot - feeAmount
}
