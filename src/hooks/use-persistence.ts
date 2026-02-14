import { useState, useCallback } from 'react'

/**
 * localStorage-based persistence hook replacing GitHub Spark's useKV.
 * Provides the same [value, setValue] API for drop-in compatibility.
 */
export function usePersistence<T>(key: string, defaultValue: T): [T, (updater: T | ((current: T) => T)) => void] {
  const [value, setValueInternal] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`bang-perp:${key}`)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // ignore parse errors
    }
    return defaultValue
  })

  const setValue = useCallback((updater: T | ((current: T) => T)) => {
    setValueInternal(prev => {
      const nextValue = typeof updater === 'function'
        ? (updater as (current: T) => T)(prev)
        : updater
      try {
        localStorage.setItem(`bang-perp:${key}`, JSON.stringify(nextValue))
      } catch {
        // ignore quota errors
      }
      return nextValue
    })
  }, [key])

  return [value, setValue]
}
