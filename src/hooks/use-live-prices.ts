import { useEffect, useState } from 'react'
import type { Market, PricePoint } from '@/lib/types'

const PRICE_UPDATE_INTERVAL = 3000

export function useLivePrices(initialMarkets: Market[]) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((market) => {
          const volatility = 0.002
          const randomChange = (Math.random() - 0.5) * 2 * volatility
          const newPrice = market.currentPrice * (1 + randomChange)
          const change24h = ((newPrice - market.basePrice) / market.basePrice) * 100

          const newHigh = Math.max(market.high24h, newPrice)
          const newLow = Math.min(market.low24h, newPrice)

          const newPricePoint: PricePoint = {
            time: Date.now(),
            price: newPrice,
            timestamp: Date.now(),
            open: market.currentPrice,
            high: Math.max(market.currentPrice, newPrice),
            low: Math.min(market.currentPrice, newPrice),
            close: newPrice,
            volume: Math.random() * 1000000,
          }

          const updatedHistory = [...market.priceHistory, newPricePoint].slice(-100)

          return {
            ...market,
            currentPrice: newPrice,
            change24h,
            high24h: newHigh,
            low24h: newLow,
            priceHistory: updatedHistory,
          }
        })
      )
    }, PRICE_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return markets
}
