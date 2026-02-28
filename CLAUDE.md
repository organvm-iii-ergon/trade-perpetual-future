# CLAUDE.md — trade-perpetual-future

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Bang Perp Exchange** — gamified Solana perpetual futures trading platform. Integrates the Drift Protocol SDK for real on-chain trading alongside a simulated market mode, with social/leaderboard features, sentiment analysis, and an achievement system.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Vite dev server
npm run build        # tsc -b --noCheck && vite build (output: dist/)
npm run lint         # ESLint (--max-warnings 0)
npm test             # Vitest watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Coverage report
```

## Architecture

React 19, TypeScript, Vite. Solana wallet adapter + Drift Protocol browser SDK. UI: shadcn/ui, Tailwind CSS, Framer Motion.

**App entry** (`src/App.tsx`): Top-level shell with 6 lazy-loaded tabs. Wallet connection via `@solana/wallet-adapter-react`. Drift SDK client (`DriftClient`) initialized on wallet connect.

**Tabs** (all lazy-loaded for code splitting):
- `DashboardTab` — portfolio overview, positions, achievements
- `MarketsTab` — real-time market data for SOL-PERP, BTC-PERP, ETH-PERP
- `TradingTab` — order entry, leverage, position management
- `GamesTabWrapper` — gamification mechanics
- `SocialTab` — leaderboard, feed, referral/affiliate
- `SettingsTab` — preferences, theme, wallet

**Key services** (`src/lib/`):
- `sentiment.ts` — `analyzeSentiment()`, `generateRealities()`, `analyzeHashtags()`, `checkForAlerts()`
- `achievements.ts` — `initializeAchievements()`, achievement definitions
- `affiliate.ts` — `generateReferralCode()`

**Key hooks** (`src/hooks/`):
- `use-persistence.ts` — localStorage-backed persistence
- `use-live-prices.ts` — real-time price feeds
- `use-drift-markets.ts` — Drift SDK market subscriptions
- `use-theme-preferences.ts` — theme management
- `use-game-program.ts` — on-chain game program integration

**Types** (`src/types/`): `Symbol`, `SentimentData`, `Reality`, `HashtagTrend`, `Alert`, `SimMarket`, `Position`, `Game`, `Achievement`, `AffiliateStats`, `LeaderboardEntry`

**Simulation**: Default `DEFAULT_SIM_MARKETS` provides SOL-PERP, BTC-PERP, ETH-PERP mock data when wallet is not connected.

**Workers** (`workers/`): Web Workers for heavy computation offloaded from the main thread.

**Tests** (`src/test/`): Vitest with jsdom.

**Path alias**: `@/*` → `src/*`

## Deployment

Live at **https://trade-perpetual-future.netlify.app** (Netlify, `main` branch auto-deploys).
