import { PublicKey } from '@solana/web3.js'

export const BANG_GAMES_PROGRAM_ID = new PublicKey('11111111111111111111111111111111') // placeholder until deployed

export const HOUSE_SEED = Buffer.from('house')
export const GAME_SEED = Buffer.from('game')
export const ESCROW_SEED = Buffer.from('escrow')

export function deriveHousePDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [HOUSE_SEED],
    BANG_GAMES_PROGRAM_ID
  )
}

export function deriveGamePDA(gameId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [GAME_SEED, Buffer.from(gameId)],
    BANG_GAMES_PROGRAM_ID
  )
}

export function deriveEscrowPDA(gameId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [ESCROW_SEED, Buffer.from(gameId)],
    BANG_GAMES_PROGRAM_ID
  )
}
