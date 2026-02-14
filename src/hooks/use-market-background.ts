import { useEffect, useState } from 'react'
import type { SimMarket } from '@/types'

export function useMarketBackground(markets: SimMarket[]) {
  const [bgGradient, setBgGradient] = useState('135deg, #667eea 0%, #764ba2 50%, #f093fb 100%')

  useEffect(() => {
    const avgChange = markets.reduce((sum, m) => sum + m.change24h, 0) / markets.length

    let gradient: string
    if (avgChange > 2) {
      gradient = '135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%'
    } else if (avgChange > 0) {
      gradient = '135deg, #667eea 0%, #764ba2 50%, #f093fb 100%'
    } else if (avgChange > -2) {
      gradient = '135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%'
    } else {
      gradient = '135deg, #ef4444 0%, #f87171 50%, #fca5a5 100%'
    }

    setBgGradient(gradient)
  }, [markets])

  return bgGradient
}
