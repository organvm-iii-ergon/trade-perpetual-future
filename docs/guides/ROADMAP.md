# Project Roadmap - Bang Perp Exchange

## Vision Statement

Bang Perp Exchange is a non-custodial perpetual futures trading platform on Solana, combining production Drift Protocol integration with a rich social trading experience featuring gamification, sentiment analysis, and personalization.

## Reference Architecture (Merged)

The original reference implementation (`perpetual-future`) has been **merged into this repository** as of v2.0.0. The full Spark prototype history is preserved on the `archive/spark-prototype` branch.

## Current State (v3.0.0)

### v3.0.0 Deliverables

- **Test Infrastructure**
  - Vitest + @testing-library/react test suite
  - 53 unit tests across 6 test files
  - 60% line coverage threshold on `src/lib/` and `src/hooks/`
  - Tests for game logic, achievements, affiliate, sentiment, persistence, ErrorFallback

- **Code Splitting**
  - React.lazy + Suspense for all 6 tab views
  - Manual chunk splitting: drift-sdk (~4.5MB deferred), solana (~500KB), charts (~386KB), animation (~123KB), react-vendor
  - TabSkeleton loading states per tab type
  - Initial load reduced from monolithic bundle to ~200KB app shell + on-demand chunks

- **Cloudflare Worker API**
  - Hono-based API at `workers/api/`
  - Sentiment routes: `/api/sentiment/:symbol`, `/api/realities/:symbol`, `/api/hashtags/:symbol`
  - Affiliate routes: `/api/affiliate/register`, `/api/affiliate/stats/:wallet`, `/api/affiliate/track-trade`, `/api/affiliate/leaderboard`
  - KV caching (15-min TTL for sentiment), rate limiting
  - Claude API integration for AI-powered sentiment with PRNG fallback

- **Cloudflare Pages Deployment**
  - GitHub Actions CI/CD: test, build, deploy Pages + deploy Worker
  - Environment-based configuration (`.env.example`)

- **Claude API Sentiment**
  - API-backed `analyzeSentiment`, `generateRealities`, `analyzeHashtags`
  - Graceful fallback to client-side PRNG when API unavailable
  - Response includes `source: 'claude' | 'fallback'` for UI transparency

- **Affiliate System Backend**
  - `registerAffiliate`, `getAffiliateStats`, `trackTrade` API functions
  - KV-backed referral tracking and commission calculations
  - Leaderboard endpoint (top 50 by commissions)

- **Drift SDK Market Integration**
  - `useDriftMarkets` hook polls oracle data every 3s
  - Live SOL/BTC/ETH price feeds when wallet connected
  - Session high/low tracking, volume/OI/funding from AMM
  - Falls back to simulated data when no wallet

- **On-Chain Gaming Architecture**
  - Anchor program IDL (`bang_games.json`) with 6 instructions
  - PDA derivation helpers (House, Game, Escrow)
  - `GameAdapter` interface with local and on-chain implementations
  - `useGameProgram` hook with mode toggle (local/on-chain)
  - Local mode fully functional; on-chain mode ready for program deployment
  - Game type now supports `'cancelled'` status + on-chain metadata fields

- **Mobile Responsiveness**
  - Bottom navigation bar for mobile (`MobileNav` component)
  - Desktop tabs hidden on mobile, bottom nav shown
  - Stats components responsive (`stats-vertical sm:stats-horizontal`)
  - Touch-friendly buttons (44px minimum height on mobile)
  - Responsive affiliate link section, preset grid, price text sizing

### Previously Implemented (v2.0.0)

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

- **Markets & Sentiment**
  - Simulated market data with live price updates
  - Symbol watchlist with add/remove
  - Sentiment analysis (now Claude API-backed with PRNG fallback)
  - Reality projections (4 scenarios per symbol)
  - Price charts (recharts)
  - Hashtag trend analysis
  - Alert system (downtrend, sentiment-drop, volatility)

- **Gaming**
  - PvP Games Arena (dice, coinflip, price prediction)
  - Achievement system (23 achievements, 4 rarity tiers)
  - Leaderboard (P&L, volume, affiliate)
  - Animated game interactions (framer-motion)

- **Social**
  - Affiliate program (referral codes, commission tracking)
  - Trending hashtags panel
  - Achievement unlock notifications

- **Personalization**
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
  - localStorage persistence

## Remaining Roadmap

### In Progress: On-Chain Gaming Program (Anchor/Rust)

- [ ] Implement Anchor program (`programs/bang-games/`) in Rust
- [ ] Integrate Switchboard VRF for provably fair randomness
- [ ] Deploy to Solana devnet for testing
- [ ] Security audit before mainnet deployment

### Phase 1: Advanced Trading (Q2 2026)

- [ ] TradingView chart integration
- [ ] Portfolio risk calculator
- [ ] Liquidation warnings
- [ ] Multi-timeframe analysis
- [ ] WebSocket subscriptions for real-time data

### Phase 2: Mobile & PWA (Q3 2026)

- [ ] Progressive Web App (PWA) manifest + service worker
- [ ] Mobile-optimized touch gestures
- [ ] Offline support for cached market data

### Phase 3: Community & Growth (Q4 2026)

- [ ] Social trading features (copy-trade)
- [ ] Tournament system for gaming
- [ ] On-chain affiliate program integration
- [ ] Multi-language support

## Alignment Progress

| Area | v1.0 | v2.0 (Post-Merge) | v3.0 (Current) |
|------|------|-------------------|-----------------|
| Core Infrastructure | 90% | 95% | 98% |
| Trading Features | 40% | 60% | 70% |
| Portfolio Management | 10% | 50% | 55% |
| Markets & Sentiment | 20% | 65% | 90% |
| Gaming | 0% | 60% | 85% |
| Social/Affiliate | 5% | 50% | 80% |
| Testing | 0% | 0% | 70% |
| Deployment | 0% | 10% | 90% |
| Mobile | 0% | 20% | 75% |
| **Overall** | **~20%** | **~50%** | **~80%** |

## Resources

- **Archive Branch**: `archive/spark-prototype` (full 11-commit Spark history)
- **Drift Protocol Docs**: [docs.drift.trade](https://docs.drift.trade/)
- **Solana Developer Docs**: [docs.solana.com](https://docs.solana.com/)
- **Anchor Framework**: [anchor-lang.com](https://www.anchor-lang.com/)
- **Cloudflare Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)

---

**Last Updated**: 2026-02-15
**Current Version**: 3.0.0
