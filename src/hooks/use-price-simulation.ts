import { useEffect, useState } from 'react'
import type { SimMarket } from '@/types'

export function usePriceSimulation(markets: SimMarket[]) {
  const [simulatedMarkets, setSimulatedMarkets] = useState<SimMarket[]>(markets)

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMarkets((prev) =>
        prev.map((market) => {
          const volatility = 0.001
          const randomChange = (Math.random() - 0.5) * 2 * volatility
          const newPrice = market.currentPrice * (1 + randomChange)
          const change24h = ((newPrice - market.basePrice) / market.basePrice) * 100

          return {
            ...market,
            currentPrice: newPrice,
            change24h,
          }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return simulatedMarkets
}
