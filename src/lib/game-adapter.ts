import type { Game } from '@/types'
import { generateSeed, rollDice, flipCoin, predictPrice, calculateGamePayout } from './game-logic'

// ─── Adapter Interface ───────────────────────────────────────────

export interface GameAdapter {
  mode: 'local' | 'on-chain'
  createGame(type: Game['type'], wager: number, creatorId: string): Promise<Game>
  joinGame(gameId: string, userId: string, games: Game[]): Promise<{ game: Game; won: boolean; payout: number }>
  cancelGame(gameId: string, games: Game[]): Promise<Game>
  getGames(): Promise<Game[]>
}

// ─── Local Adapter (existing localStorage-based logic) ───────────

export function createLocalGameAdapter(
  getGames: () => Game[],
  setGames: (updater: (prev: Game[]) => Game[]) => void,
  getBalance: () => number,
  setBalance: (updater: (prev: number) => number) => void,
): GameAdapter {
  return {
    mode: 'local',

    async createGame(type, wager, creatorId) {
      if (wager > getBalance()) throw new Error('Insufficient balance')

      setBalance(prev => prev - wager)

      const game: Game = {
        id: `game-${Date.now()}`,
        type,
        wager,
        creatorId,
        status: 'waiting',
        createdAt: Date.now(),
      }

      setGames(prev => [game, ...prev])
      return game
    },

    async joinGame(gameId, userId, currentGames) {
      const game = currentGames.find(g => g.id === gameId)
      if (!game) throw new Error('Game not found')
      if (game.wager > getBalance()) throw new Error('Insufficient balance')

      setBalance(prev => prev - game.wager)

      // Resolve game using seeded random
      const seed = generateSeed()
      let winnerId: string
      if (game.type === 'dice') {
        const creatorRoll = rollDice(seed + 'creator')
        const opponentRoll = rollDice(seed + 'opponent')
        winnerId = creatorRoll >= opponentRoll ? game.creatorId : userId
      } else if (game.type === 'coinflip') {
        winnerId = flipCoin(seed) === 'heads' ? game.creatorId : userId
      } else {
        winnerId = Math.random() > 0.5 ? game.creatorId : userId
      }

      const won = winnerId === userId
      const payout = won ? calculateGamePayout(game.wager) : 0

      if (won) {
        setBalance(prev => prev + payout)
      }

      const updatedGame: Game = {
        ...game,
        status: 'completed',
        opponentId: userId,
        result: { winnerId, outcome: { seed }, timestamp: Date.now() },
      }

      setGames(prev => prev.map(g => g.id === gameId ? updatedGame : g))
      return { game: updatedGame, won, payout }
    },

    async cancelGame(gameId, currentGames) {
      const game = currentGames.find(g => g.id === gameId)
      if (!game) throw new Error('Game not found')
      if (game.status !== 'waiting') throw new Error('Cannot cancel active game')

      setBalance(prev => prev + game.wager)

      const cancelled: Game = { ...game, status: 'cancelled' as Game['status'] }
      setGames(prev => prev.map(g => g.id === gameId ? cancelled : g))
      return cancelled
    },

    async getGames() {
      return getGames()
    },
  }
}

// ─── On-Chain Adapter (Anchor program) ───────────────────────────

export function createOnChainGameAdapter(): GameAdapter {
  return {
    mode: 'on-chain',

    async createGame(_type, _wager, _creatorId) {
      throw new Error('On-chain gaming program not yet deployed. Switch to Local mode.')
    },

    async joinGame(_gameId, _userId) {
      throw new Error('On-chain gaming program not yet deployed. Switch to Local mode.')
    },

    async cancelGame(_gameId) {
      throw new Error('On-chain gaming program not yet deployed. Switch to Local mode.')
    },

    async getGames() {
      return []
    },
  }
}
