import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistence } from './use-persistence'

beforeEach(() => {
  localStorage.clear()
})

describe('usePersistence', () => {
  it('returns default value when nothing stored', () => {
    const { result } = renderHook(() => usePersistence('test-key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => usePersistence('persist-key', 'initial'))
    act(() => { result.current[1]('updated') })
    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('bang-perp:persist-key')).toBe('"updated"')
  })

  it('reads persisted value on mount', () => {
    localStorage.setItem('bang-perp:read-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => usePersistence('read-key', 'default'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('supports updater function', () => {
    const { result } = renderHook(() => usePersistence('counter', 0))
    act(() => { result.current[1]((prev: number) => prev + 1) })
    expect(result.current[0]).toBe(1)
    act(() => { result.current[1]((prev: number) => prev + 5) })
    expect(result.current[0]).toBe(6)
  })

  it('handles complex objects', () => {
    const defaultObj = { name: 'test', items: [1, 2, 3] }
    const { result } = renderHook(() => usePersistence('obj-key', defaultObj))
    expect(result.current[0]).toEqual(defaultObj)

    const newObj = { name: 'updated', items: [4, 5] }
    act(() => { result.current[1](newObj) })
    expect(result.current[0]).toEqual(newObj)
  })

  it('falls back to default on corrupted storage', () => {
    localStorage.setItem('bang-perp:corrupt', 'not-valid-json{{{')
    const { result } = renderHook(() => usePersistence('corrupt', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
