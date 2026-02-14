# Project Roadmap - Bang Perp Exchange

## Vision Statement

Bang Perp Exchange is a non-custodial perpetual futures trading platform on Solana, combining production Drift Protocol integration with a rich social trading experience featuring gamification, sentiment analysis, and personalization.

## Reference Architecture (Merged)

The original reference implementation (`perpetual-future`) has been **merged into this repository** as of v2.0.0. The full Spark prototype history is preserved on the `archive/spark-prototype` branch.

The merge brought:
- 22 domain components (markets, gaming, social, personalization)
- 7 custom hooks (persistence, live prices, particles, themes, etc.)
- 7 lib modules (achievements, affiliate, game logic, sentiment, themes, etc.)
- Glassmorphism design system with 15+ animations
- Complete type system (20+ interfaces)

## Current State (v2.0.0)

### Implemented Features

- **Core Trading (Production)**
  - Solana wallet integration (Phantom, Solflare)
  - Drift Protocol SDK integration
  - Market/Limit/Stop orders
  - Leverage selection (1x-20x)
  - SOL-PERP, BTC-PERP, ETH-PERP markets
  - Position management (open, close, modify)
  - Order history with filters
  - P&L analytics with timeframes
  - Risk warnings and disclosures

- **Markets & Sentiment (Merged from archive)**
  - Simulated market data with live price updates
  - Symbol watchlist with add/remove
  - Sentiment analysis (simulated, hourly drift)
  - Reality projections (4 scenarios per symbol)
  - Price charts (recharts)
  - Hashtag trend analysis
  - Alert system (downtrend, sentiment-drop, volatility)

- **Gaming (Merged from archive)**
  - PvP Games Arena (dice, coinflip, price prediction)
  - Achievement system (23 achievements, 4 rarity tiers)
  - Leaderboard (P&L, volume, affiliate)
  - Animated game interactions (framer-motion)

- **Social (Merged from archive)**
  - Affiliate program (referral codes, commission tracking)
  - Trending hashtags panel
  - Achievement unlock notifications

- **Personalization (Merged from archive)**
  - 7 visual themes (cosmic, sunset, ocean, forest, aurora, neon, minimal)
  - Cursor particle effects
  - Dynamic background (canvas-based, sentiment-aware)
  - Glass effect intensity controls
  - Animation speed controls
  - 3 quick presets (quick, balanced, maximum)

- **Infrastructure**
  - React 19 + TypeScript 5.7
  - Vite 6 with Tailwind CSS v4
  - DaisyUI v5 component system
  - Path aliases (`@/`)
  - ErrorBoundary + toast notifications
  - localStorage persistence (replacing Spark KV)

## Remaining Roadmap

### Phase 1: Polish & Integration (Q1 2026)

- [ ] Connect simulated markets to real Drift price feeds
- [ ] Wire achievement checks to actual trading events
- [ ] Add WebSocket subscriptions for real-time data
- [ ] Implement proper affiliate tracking with on-chain referral codes

### Phase 2: Advanced Trading (Q2 2026)

- [ ] TradingView chart integration
- [ ] Portfolio risk calculator
- [ ] Liquidation warnings
- [ ] Multi-timeframe analysis

### Phase 3: Mobile & Performance (Q3 2026)

- [ ] Progressive Web App (PWA)
- [ ] Mobile-optimized touch gestures
- [ ] Code splitting and lazy loading
- [ ] Service worker for offline support

## Alignment Progress

| Area | Pre-Merge | Post-Merge |
|------|-----------|------------|
| Core Infrastructure | 90% | 95% |
| Trading Features | 40% | 60% |
| Portfolio Management | 10% | 50% |
| Advanced Features | 5% | 70% |
| **Overall** | **~35%** | **~80%** |

## Resources

- **Archive Branch**: `archive/spark-prototype` (full 11-commit Spark history)
- **Drift Protocol Docs**: [docs.drift.trade](https://docs.drift.trade/)
- **Solana Developer Docs**: [docs.solana.com](https://docs.solana.com/)

---

**Last Updated**: 2026-02-14
**Current Version**: 2.0.0
