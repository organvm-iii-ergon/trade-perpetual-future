import { useState, useMemo } from 'react'
import type { GameAdapter } from '@/lib/game-adapter'
import { createLocalGameAdapter, createOnChainGameAdapter } from '@/lib/game-adapter'
import type { Game } from '@/types'

interface UseGameProgramOptions {
  getGames: () => Game[]
  setGames: (updater: (prev: Game[]) => Game[]) => void
  getBalance: () => number
  setBalance: (updater: (prev: number) => number) => void
}

export function useGameProgram(options: UseGameProgramOptions) {
  const [mode, setMode] = useState<'local' | 'on-chain'>('local')

  const adapter: GameAdapter = useMemo(() => {
    if (mode === 'on-chain') {
      return createOnChainGameAdapter()
    }
    return createLocalGameAdapter(
      options.getGames,
      options.setGames,
      options.getBalance,
      options.setBalance,
    )
  }, [mode, options.getGames, options.setGames, options.getBalance, options.setBalance])

  return { adapter, mode, setMode }
}
