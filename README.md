[![ORGAN-III: Ergon](https://img.shields.io/badge/ORGAN--III-Ergon-1b5e20?style=flat-square)](https://github.com/organvm-iii-ergon)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0-5A0EF8?style=flat-square)](https://daisyui.com/)
[![Vitest](https://img.shields.io/badge/Vitest-53_tests-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat-square&logo=solana&logoColor=white)](https://solana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

# trade-perpetual-future

[![CI](https://github.com/organvm-iii-ergon/trade-perpetual-future/actions/workflows/ci.yml/badge.svg)](https://github.com/organvm-iii-ergon/trade-perpetual-future/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-pending-lightgrey)](https://github.com/organvm-iii-ergon/trade-perpetual-future)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/organvm-iii-ergon/trade-perpetual-future/blob/main/LICENSE)
[![Organ III](https://img.shields.io/badge/Organ-III%20Ergon-F59E0B)](https://github.com/organvm-iii-ergon)
[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/organvm-iii-ergon/trade-perpetual-future)
[![Version](https://img.shields.io/badge/version-3.0.0-informational)](https://github.com/organvm-iii-ergon/trade-perpetual-future)


**A non-custodial perpetual futures trading platform on Solana, powered by Drift Protocol — with AI-driven sentiment, on-chain gaming, and a Cloudflare Worker backend.**

Users connect browser wallets (Phantom, Solflare) and trade leveraged perpetual contracts (SOL-PERP, BTC-PERP, ETH-PERP) directly against Drift Protocol smart contracts. The platform never touches user funds. Revenue accrues through Drift's on-chain Builder Code referral system — a compliant, zero-custody affiliate model where 10-15% of trading fees are paid automatically to the platform operator.

This is an **ORGAN-III (Ergon)** repository — the commerce organ of the [organvm](https://github.com/meta-organvm) creative-institutional system. ORGAN-III houses production-grade SaaS, B2B, and B2C products. `trade-perpetual-future` is a B2C financial product that demonstrates full-stack blockchain integration, protocol-level revenue engineering, and non-custodial security architecture.

---

## Table of Contents

- [Product Overview](#product-overview)
- [Why This Exists](#why-this-exists)
- [Technical Architecture](#technical-architecture)
- [System Components](#system-components)
- [Installation and Quick Start](#installation-and-quick-start)
- [Usage Guide](#usage-guide)
- [Features](#features)
- [Configuration](#configuration)
- [Architectural Decision Records](#architectural-decision-records)
- [Security Model](#security-model)
- [Revenue Model](#revenue-model)
- [Deployment](#deployment)
- [Cross-Organ Context](#cross-organ-context)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Related Work](#related-work)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Product Overview

Perpetual futures ("perps") are the dominant trading instrument in crypto markets — contracts that let traders speculate on asset prices with leverage, without expiration dates. The global crypto derivatives market regularly exceeds $100B in daily volume. Most of that volume flows through centralized exchanges (Binance, Bybit), which custody user funds and operate opaque matching engines.

`trade-perpetual-future` takes a different approach. It is a **full-stack trading platform** — a React SPA backed by a Cloudflare Worker API — that connects users directly to [Drift Protocol](https://drift.trade), Solana's largest decentralized perpetual futures exchange. The platform:

- **Never custodies funds.** Users sign every transaction in their own wallet. Private keys never leave the browser extension.
- **Delegates all trading logic to audited smart contracts.** Order matching, liquidation, funding rates, and settlement all happen on-chain via Drift Protocol's program accounts.
- **Generates revenue without holding money.** The Drift Builder Code system attributes trades to the referring frontend and pays a percentage of protocol fees directly to the operator's wallet — no invoicing, no payment processing, no custodial risk.
- **Enhances trading with AI sentiment.** A Cloudflare Worker API proxies Claude for market sentiment analysis, reality scenario generation, and hashtag trend detection — with PRNG fallbacks for zero-downtime operation.
- **Deploys on Cloudflare.** Pages for the SPA, Workers for the API, KV for caching and affiliate state. Infrastructure cost approaches zero.

This architecture produces a product that is simultaneously simpler to operate, harder to attack, and more transparent than traditional alternatives.

### Core Capabilities

| Capability | Implementation |
|-----------|----------------|
| **Markets** | SOL-PERP, BTC-PERP, ETH-PERP (expandable via `markets.ts`) |
| **Order types** | Market, Limit, Stop Market |
| **Leverage** | 1x to 10x, visual slider control |
| **Position management** | Real-time open positions, one-click close, P&L tracking |
| **Account dashboard** | Total collateral, net USD value, unrealized P&L, current leverage |
| **Sentiment analysis** | AI-powered market sentiment with Claude (PRNG fallback) |
| **Gaming** | Coin flip, dice roll, prediction games with achievements and leaderboards |
| **Affiliate system** | Referral codes, commission tracking, affiliate leaderboard |
| **Personalization** | 7 themes, glassmorphism, dynamic backgrounds, cursor particles |
| **Wallets** | Phantom, Solflare, UnsafeBurner (devnet testing) |
| **Data refresh** | Oracle prices every 3s (live) or PRNG simulation (disconnected) |

---

## Why This Exists

Three motivations drive this project:

**1. Non-custodial DeFi needs better frontends.** Drift Protocol is a powerful on-chain exchange, but its official frontend serves a general audience. There is room for specialized trading interfaces — optimized for specific user segments, branded for specific distribution channels, or bundled into larger product suites. `trade-perpetual-future` demonstrates that a single developer can build and operate a compliant trading frontend with near-zero infrastructure cost.

**2. Revenue engineering without custody.** The Drift Builder Code model is a new primitive in crypto economics: a protocol-level referral system where revenue attribution happens entirely on-chain. This project explores what it means to build a profitable product that never touches user money — a pattern that extends well beyond crypto into any domain where protocol-level revenue sharing exists.

**3. Portfolio demonstration.** This is a fully functional financial product built with production-quality TypeScript, React 19, and blockchain integration. It demonstrates competence in: wallet adapter patterns, SDK integration, real-time data subscriptions, transaction construction, Cloudflare Worker APIs, AI integration (Claude), code splitting and lazy loading, gaming mechanics, and mobile-responsive design.

---

## Technical Architecture

The system follows a **full-stack non-custodial** pattern. The frontend SPA handles UI and wallet interaction. A Cloudflare Worker provides AI sentiment analysis, affiliate tracking, and caching. All trading state lives on-chain in Solana program accounts managed by Drift Protocol.

```
User's Browser
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  React 19 SPA (Vite 6 + TypeScript 5.7)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Dashboard   │  │   Markets    │  │   Trading    │               │
│  │  Tab         │  │   Tab        │  │   Tab        │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Games      │  │   Social     │  │  Settings    │               │
│  │   Tab        │  │   Tab        │  │   Tab        │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
│  37+ components across 9 directories                                 │
│  Code-split with React.lazy() + Suspense                             │
│                                                                      │
│  Solana Wallet Adapter (React Context)                               │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │ Phantom Adapter   │  │ Solflare Adapter │                         │
│  └──────────────────┘  └──────────────────┘                         │
│                                                                      │
└──────────┬──────────────────────────────────────┬────────────────────┘
           │ JSON-RPC over HTTPS                  │ HTTPS
           ▼                                      ▼
┌──────────────────────────┐   ┌───────────────────────────────────────┐
│  Solana Blockchain       │   │  Cloudflare Worker API                │
│  ┌────────────────────┐  │   │  ┌──────────────┐  ┌──────────────┐  │
│  │  Drift Protocol    │  │   │  │  Sentiment   │  │  Affiliate   │  │
│  │  Smart Contracts   │  │   │  │  (Claude AI) │  │  (KV Store)  │  │
│  │  ┌──────┐ ┌─────┐ │  │   │  └──────────────┘  └──────────────┘  │
│  │  │ User │ │Perp │ │  │   │  ┌──────────────┐  ┌──────────────┐  │
│  │  │ Acct │ │Mkts │ │  │   │  │  Rate Limit  │  │  KV Cache    │  │
│  │  └──────┘ └─────┘ │  │   │  └──────────────┘  └──────────────┘  │
│  │  ┌──────────────┐  │  │   └───────────────────────────────────────┘
│  │  │ Oracle (Pyth/ │  │  │
│  │  │ Switchboard)  │  │  │
│  │  └──────────────┘  │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Data Flow: Trade Execution

1. User selects market, enters amount, chooses leverage, picks order type (Market / Limit / Stop).
2. `TradePanel` computes position size (`amount * leverage`) and constructs Drift SDK order parameters.
3. For **Market orders**: `driftClient.placeAndTakePerpOrder()` creates and fills in a single atomic transaction.
4. For **Limit orders**: `getLimitOrderParams()` places a resting order at the specified price.
5. For **Stop Market orders**: `getTriggerMarketOrderParams()` places a trigger-conditional order.
6. The Drift SDK serializes the instruction, the wallet adapter prompts the user to sign, and the signed transaction is submitted to Solana via JSON-RPC.
7. On confirmation, the UI updates via polling (prices every 3 seconds, positions every 5 seconds).

### Data Flow: Sentiment & Social

1. Frontend requests sentiment for a symbol from the Worker API (`/api/sentiment`).
2. Worker checks KV cache — if cached and fresh, returns immediately.
3. On cache miss, Worker calls Claude API with a market analysis prompt.
4. Claude response is cached in KV with TTL, then returned to frontend.
5. If Claude API fails or rate limit is hit, Worker returns PRNG fallback data.

---

## System Components

### Frontend Layer

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Framework | React | 19.0 | Component rendering and state management |
| Language | TypeScript | 5.7.2 | Type-safe development across all modules |
| Build tool | Vite | 6.3.5 | ESM-native bundler with HMR and tree-shaking |
| Styling | Tailwind CSS + DaisyUI | 4.1 / 5.0 | Utility-first CSS with 7 switchable themes |
| Testing | Vitest + Testing Library | 4.0.18 | 53 unit tests with JSDOM environment |
| Animation | Framer Motion | 12.6 | Achievement notifications, transitions |
| Charts | Recharts + D3 | 2.15 / 7.9 | Price charts and analytics visualizations |
| Polyfills | vite-plugin-node-polyfills | 0.22.0 | Buffer/process shims for browser-side Solana SDK |

### Backend Layer

| Component | Technology | Role |
|-----------|-----------|------|
| API Runtime | Cloudflare Workers | Edge-deployed API for sentiment, affiliate, caching |
| AI Provider | Claude (Anthropic) | Market sentiment analysis, reality scenarios, hashtag trends |
| Cache/State | Cloudflare KV | Sentiment cache (TTL), affiliate stats persistence |
| Rate Limiting | Custom middleware | Per-IP rate limiting on API routes |

### Blockchain Layer

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Blockchain | Solana | — | Layer 1 settlement and program execution |
| RPC client | @solana/web3.js | 1.98.4 | Connection management, transaction submission |
| Wallet adapter | @solana/wallet-adapter-react | 0.15.39 | React context for wallet connection lifecycle |
| Trading SDK | @drift-labs/sdk-browser | 2.152.0-beta.2 | Drift Protocol client, order construction, account reads |
| Gaming program | Anchor (scaffold) | — | On-chain gaming with Switchboard VRF (in development) |

### Component Map

The application is organized into 9 component directories with 37+ components:

| Directory | Components | Responsibility |
|-----------|-----------|----------------|
| `components/tabs/` | DashboardTab, MarketsTab, TradingTab, GamesTabWrapper, SocialTab, SettingsTab | Top-level tab views (lazy-loaded) |
| `components/trading/` | TradePanel, PositionPanel, OrderHistory | Order execution, position management, order lifecycle |
| `components/analytics/` | DashboardPanel, PnLAnalytics | Account statistics, performance metrics |
| `components/markets/` | MarketCard, SymbolCard, PriceChart, RealityCard, PositionCard, AddSymbolDialog | Market data display, price visualization, watchlist |
| `components/gaming/` | GamesTab, EnhancedGamesTab, AchievementCard, AchievementsTab, AchievementUnlockNotification, LeaderboardTab | Gaming UI, achievements, leaderboards |
| `components/social/` | AffiliateTab, HashtagPanel, SignInPage | Affiliate tracking, social sentiment, auth |
| `components/personalization/` | CursorParticles, DynamicBackground, PersonalizationPanel | Visual customization |
| `components/common/` | AlertBanner, ErrorFallback, GlassTooltip, MobileNav, RiskWarning, Soothsayer, TabSkeleton | Shared UI primitives |
| `hooks/` | useDriftMarkets, useLivePrices, useGameProgram, usePersistence, useThemePreferences, useIsMobile, useCursorParticles, useMarketBackground, usePriceSimulation | Custom React hooks |

---

## Installation and Quick Start

### Prerequisites

- **Node.js 20+** and npm (the project uses ESM modules via `"type": "module"`)
- **A Solana wallet**: Install the [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/) browser extension
- **SOL for gas**: On devnet, get free SOL from the [Solana Faucet](https://faucet.solana.com/)
- **A Drift account**: Create one at [drift.trade](https://drift.trade) (switch to devnet in settings) and deposit USDC from Drift's faucet

### Setup

```bash
# Clone the repository
git clone https://github.com/organvm-iii-ergon/trade-perpetual-future.git
cd trade-perpetual-future

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env.local
# Edit .env.local — defaults target Solana devnet, which is correct for development

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_RPC_ENDPOINT` | `https://api.devnet.solana.com` | Solana RPC endpoint. For production, use a premium provider (QuickNode, Helius). |
| `VITE_DRIFT_ENV` | `devnet` | Drift environment. Set to `mainnet-beta` for real trading. |
| `VITE_DRIFT_BUILDER_CODE` | *(empty)* | Your Drift Builder Code public key for earning referral revenue. Register at [docs.drift.trade/partnerships/DBC](https://docs.drift.trade/partnerships/DBC). |
| `VITE_API_BASE` | `http://localhost:8787` | Cloudflare Worker API URL. Set to production Worker URL when deployed. |

### Worker Development

```bash
# Install Worker dependencies
cd workers/api && npm install

# Start local Worker (requires Wrangler)
npx wrangler dev

# Deploy Worker
npx wrangler deploy
```

### Build for Production

```bash
# Type-check and build
npm run build

# Preview the production build locally
npm run preview
```

The output lands in `./dist/` — a fully static bundle ready for Cloudflare Pages or any static host.

---

## Usage Guide

### 1. Connect Your Wallet

Click **Select Wallet** in the navigation bar. Choose Phantom or Solflare. Approve the connection request in your wallet extension. The application will automatically initialize the Drift Protocol client and subscribe to your on-chain account. Market data switches from simulated PRNG prices to live Drift oracle data.

### 2. Dashboard

Once connected, the Dashboard tab displays four real-time metrics: **Total Collateral** (your deposited USDC), **Net USD Value** (total account value including open positions), **Unrealized P&L** (profit or loss on open positions), and **Current Leverage** (aggregate leverage across all positions). These values update from on-chain state.

### 3. Markets

The Markets tab shows live price cards for all supported perps — current price, 24h change, volume, open interest, and funding rate. Add symbols to your watchlist, view PRNG price charts, and explore AI-generated sentiment analysis (realities, hashtag trends).

### 4. Place a Trade

In the Trading tab:
- **Select a market**: SOL-PERP, BTC-PERP, or ETH-PERP. Oracle price, bid, and ask update in real-time.
- **Choose an order type**: Market (instant fill), Limit (fill at your price or better), or Stop Market (trigger when price crosses your threshold).
- **Enter the amount** in USDC and set leverage from 1x to 10x using the slider.
- **Execute**: Click LONG (price up) or SHORT (price down). Your wallet will prompt you to sign the transaction.

### 5. Games

The Games tab offers provably fair games — coin flip, dice roll, and prediction markets. Earn achievements, climb the leaderboard, and compete for affiliate bonuses. Games run on localStorage in simulation mode; on-chain mode (via the Anchor program) is in development.

### 6. Social & Settings

The Social tab shows your affiliate referral code, commission stats, and the community leaderboard. The Settings tab lets you switch between 7 themes, toggle cursor particles, and configure personalization options.

---

## Features

### Trading Engine

- **Three order types**: Market orders for immediate execution, limit orders for price-specific entries, and stop market orders for automated risk management via trigger conditions.
- **Configurable leverage**: 1x to 10x with a visual slider. Position size is calculated as `amount * leverage` and displayed in real-time before execution.
- **Multi-market support**: SOL-PERP, BTC-PERP, ETH-PERP out of the box. Adding a new market requires a single entry in `src/utils/markets.ts`.

### Live Market Data

- **Dual-mode pricing**: `useDriftMarkets` reads real Drift oracle data when wallet is connected; `useLivePrices` provides PRNG simulation when disconnected.
- **Oracle prices**: Pyth and Switchboard oracle feeds via the Drift SDK, refreshed every 3 seconds.
- **Volume and open interest**: Computed from AMM state of each perp market account.
- **Price history**: 100-point rolling buffer for each market, feeding the price chart components.

### AI Sentiment (via Cloudflare Worker)

- **Market sentiment**: Claude-powered analysis of market conditions — score, signal (bullish/bearish/neutral), and narrative summary.
- **Reality scenarios**: AI-generated possible futures for each market based on current price and sentiment.
- **Hashtag trends**: Trending topics and sentiment signals across the crypto social landscape.
- **PRNG fallback**: All sentiment features work offline with deterministic pseudo-random generation.

### Gaming System

- **Three game types**: Coin flip (50/50), dice roll (configurable odds), prediction (market direction bets).
- **Achievement engine**: 15 unlockable achievements with 4 badge tiers (bronze, silver, gold, platinum).
- **Leaderboard**: Ranked by volume, P&L, and win rate.
- **Dual adapter**: `useGameProgram` switches between localStorage (simulation) and on-chain (Anchor program) seamlessly.

### Personalization

- **7 themes**: Dark, light, cyberpunk, synthwave, dracula, night, luxury — switchable at runtime via DaisyUI.
- **Glassmorphism**: Glass panels with backdrop blur, frosted card effects, gradient text animations.
- **Dynamic backgrounds**: Market-driven animated backgrounds that respond to price movements.
- **Cursor particles**: Toggleable particle trail effect.

### Mobile Experience

- **Responsive layout**: All 6 tabs optimized for mobile viewports.
- **Bottom navigation**: `MobileNav` component with tab icons for thumb-friendly navigation.
- **Touch optimized**: Larger tap targets, swipe-friendly card layouts.

---

## Configuration

### Adding a New Market

Edit `src/utils/markets.ts`:

```typescript
export const markets: Market[] = [
  { name: 'SOL-PERP', index: 0, marketIndex: 0, symbol: 'SOL' },
  { name: 'BTC-PERP', index: 1, marketIndex: 1, symbol: 'BTC' },
  { name: 'ETH-PERP', index: 2, marketIndex: 2, symbol: 'ETH' },
  // Add new markets — marketIndex must match Drift Protocol's market index
  { name: 'RNDR-PERP', index: 3, marketIndex: 24, symbol: 'RNDR' },
]
```

### Switching to Mainnet

Update `.env.local`:

```ini
VITE_RPC_ENDPOINT=https://your-premium-rpc-endpoint.com
VITE_DRIFT_ENV=mainnet-beta
VITE_DRIFT_BUILDER_CODE=your_builder_code_public_key
VITE_API_BASE=https://bang-perp-api.your-subdomain.workers.dev
```

A premium RPC provider (QuickNode, Helius, Triton) is required for production use. The default Solana public RPC endpoint has aggressive rate limits that will degrade the trading experience.

---

## Architectural Decision Records

This project maintains formal ADRs in `docs/adr/`:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| [ADR-0001](./docs/adr/0001-use-blockchain-storage-instead-of-database.md) | Blockchain storage instead of database | Non-custodial architecture requires on-chain state; no backend database means no data breach risk. |
| [ADR-0002](./docs/adr/0002-frontend-only-architecture.md) | Frontend-only core (trading) | Smart contracts provide all trading logic. The Worker API handles only supplementary features (sentiment, affiliate). |
| [ADR-001](./docs/adr/001-initial-architecture.md) | Initial architecture decisions | Foundational choices for the v1.0 system. |
| [ADR-002](./docs/adr/002-integration-patterns.md) | Integration patterns | How the system integrates with Drift Protocol and external services. |

The core non-custodial guarantee is maintained even with the Worker API — the Worker never touches funds, keys, or trading logic. It only handles supplementary features (sentiment analysis, affiliate tracking) that enhance the UX.

---

## Security Model

The security architecture has four layers, each handled by a different system:

| Layer | System | What It Protects |
|-------|--------|------------------|
| **Private keys** | Wallet extension (Phantom/Solflare) | Keys never leave the browser extension. The application has no access to signing keys. |
| **Transaction authorization** | User signature | Every trade, position close, and order placement requires explicit user approval in the wallet UI. |
| **Trading logic** | Drift Protocol smart contracts | Order matching, liquidation, funding rates, and settlement are handled by audited on-chain programs. |
| **Settlement** | Solana blockchain | Proof of History + Proof of Stake consensus. Immutable transaction ledger with ~400ms block times. |

### What the Platform Does NOT Do

- Does not store private keys or seed phrases
- Does not custody user funds at any point
- Does not implement trading logic (all logic is on-chain)
- Does not store user PII in any database
- The Worker API handles only sentiment and affiliate data — never funds or keys

### Attack Surface

| Vector | Risk Level | Mitigation |
|--------|-----------|------------|
| XSS | Low | React auto-escapes output; CSP headers planned for production |
| Supply chain | Medium | `npm audit` in CI; `package-lock.json` pinning; minimal dependency surface |
| Phishing / impersonation | Medium | Clear branding; wallet address verification; risk warnings |
| Smart contract exploit | Low | Using Drift Protocol — audited and battle-tested with >$1B in cumulative volume |
| Worker API abuse | Low | Rate limiting per IP; KV-backed request tracking; PRNG fallback on failure |
| RPC endpoint compromise | Low | Users can configure their own RPC endpoint; premium providers offer authenticated access |

---

## Revenue Model

Revenue is generated through Drift Protocol's **Builder Code** system — a protocol-level referral mechanism:

1. **Register** for a Builder Code at [docs.drift.trade/partnerships/DBC](https://docs.drift.trade/partnerships/DBC).
2. **Configure** the code in `VITE_DRIFT_BUILDER_CODE`.
3. **Earn** 10-15% of trading fees from users who trade through your frontend.
4. **Revenue flows on-chain** — paid automatically to your wallet, no invoicing or payment processing.

Additionally, the affiliate system enables user-to-user referrals — referred users generate additional platform volume, increasing Builder Code revenue.

---

## Deployment

### Cloudflare Pages + Workers (Recommended)

The production deployment target is Cloudflare:

1. **Deploy the Worker API**:
   ```bash
   cd workers/api
   wrangler kv:namespace create SENTIMENT_CACHE
   wrangler kv:namespace create AFFILIATE_KV
   # Update wrangler.toml with real namespace IDs
   wrangler secret put ANTHROPIC_API_KEY
   wrangler deploy
   ```

2. **Deploy the frontend**:
   ```bash
   npm run build
   wrangler pages deploy dist/
   ```

3. **Set environment variables** in Cloudflare Pages dashboard:
   - `VITE_RPC_ENDPOINT` — Premium RPC URL
   - `VITE_DRIFT_ENV` — `devnet` or `mainnet-beta`
   - `VITE_DRIFT_BUILDER_CODE` — Your Builder Code
   - `VITE_API_BASE` — Your Worker URL

### Alternative: Static Hosting

The SPA works on any static host (Vercel, Netlify, GitHub Pages) — sentiment and affiliate features will use PRNG fallbacks without the Worker API.

### Production Checklist

Before deploying to mainnet:

- [ ] Switch `VITE_DRIFT_ENV` to `mainnet-beta`
- [ ] Use a premium RPC endpoint (not the public devnet endpoint)
- [ ] Configure your Drift Builder Code for revenue attribution
- [ ] Deploy Worker with real KV namespaces and `ANTHROPIC_API_KEY`
- [ ] Test all order types (market, limit, stop) with real funds on a small scale
- [ ] Verify wallet connection and disconnection flows
- [ ] Set up error monitoring (Sentry or equivalent)
- [ ] Add CSP headers via `_headers` file
- [ ] Review jurisdiction-specific legal compliance for derivatives trading

---

## Cross-Organ Context

This repository operates within the [organvm](https://github.com/meta-organvm) eight-organ creative-institutional system:

| Relationship | Organ | Repository | Connection |
|-------------|-------|-----------|------------|
| **Theory** | [ORGAN-I: Theoria](https://github.com/organvm-i-theoria) | [recursive-engine](https://github.com/organvm-i-theoria/recursive-engine--generative-entity) | The epistemological framework that governs how systems observe and refine themselves. `trade-perpetual-future` embodies recursive product design: delegating complexity to protocol-level primitives while iterating on the interface layer. |
| **Orchestration** | [ORGAN-IV: Taxis](https://github.com/organvm-iv-taxis) | [agentic-titan](https://github.com/organvm-iv-taxis/agentic-titan) | The governance and routing layer for agent-driven workflows. The non-custodial architecture pattern here — delegating execution to audited external systems while retaining control of the interface — is the same pattern `agentic-titan` applies to AI agent orchestration. |
| **Public Process** | [ORGAN-V: Logos](https://github.com/organvm-v-logos) | [public-process](https://github.com/organvm-v-logos/public-process) | The building-in-public narrative layer. Development decisions, architectural trade-offs, and revenue model analysis from this project feed into ORGAN-V essays. |

**Dependency direction**: ORGAN-I (theory) informs ORGAN-III (commerce) informs ORGAN-V (narrative). No back-edges.

---

## Project Structure

```
trade-perpetual-future/
├── src/
│   ├── main.tsx                              # Wallet provider setup (Connection, Wallet, Modal)
│   ├── App.tsx                               # Root component, Drift init, 6-tab layout
│   ├── index.css                             # Global styles (Tailwind 4 directives, glassmorphism)
│   ├── components/
│   │   ├── tabs/                             # 6 lazy-loaded tab views
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── MarketsTab.tsx
│   │   │   ├── TradingTab.tsx
│   │   │   ├── GamesTabWrapper.tsx
│   │   │   ├── SocialTab.tsx
│   │   │   └── SettingsTab.tsx
│   │   ├── trading/                          # Trading components
│   │   │   ├── TradePanel.tsx                # Order form: market/limit/stop execution
│   │   │   ├── PositionPanel.tsx             # Active positions with close actions
│   │   │   └── OrderHistory.tsx              # Order lifecycle tracking
│   │   ├── analytics/                        # Dashboard components
│   │   │   ├── DashboardPanel.tsx            # Account statistics
│   │   │   └── PnLAnalytics.tsx              # Performance dashboard
│   │   ├── markets/                          # Market data components
│   │   │   ├── MarketCard.tsx                # Price card with 24h stats
│   │   │   ├── SymbolCard.tsx                # Watchlist symbol display
│   │   │   ├── PriceChart.tsx                # Price history visualization
│   │   │   ├── RealityCard.tsx               # AI-generated scenario card
│   │   │   ├── PositionCard.tsx              # Sim position display
│   │   │   └── AddSymbolDialog.tsx           # Watchlist add dialog
│   │   ├── gaming/                           # Gaming components
│   │   │   ├── GamesTab.tsx                  # Game creation and joining
│   │   │   ├── EnhancedGamesTab.tsx          # Enhanced game UI
│   │   │   ├── AchievementCard.tsx           # Individual achievement display
│   │   │   ├── AchievementsTab.tsx           # Achievement gallery
│   │   │   ├── AchievementUnlockNotification.tsx  # Toast notification
│   │   │   └── LeaderboardTab.tsx            # Rankings display
│   │   ├── social/                           # Social components
│   │   │   ├── AffiliateTab.tsx              # Referral dashboard
│   │   │   ├── HashtagPanel.tsx              # Trending hashtags
│   │   │   └── SignInPage.tsx                # Auth flow
│   │   ├── personalization/                  # Visual customization
│   │   │   ├── CursorParticles.tsx           # Particle trail effect
│   │   │   ├── DynamicBackground.tsx         # Market-driven background
│   │   │   └── PersonalizationPanel.tsx      # Settings UI
│   │   └── common/                           # Shared components
│   │       ├── AlertBanner.tsx               # Alert notifications
│   │       ├── ErrorFallback.tsx             # Error boundary UI
│   │       ├── GlassTooltip.tsx              # Glassmorphism tooltip
│   │       ├── MobileNav.tsx                 # Mobile bottom navigation
│   │       ├── RiskWarning.tsx               # Risk disclosures
│   │       ├── Soothsayer.tsx                # Contextual guidance
│   │       └── TabSkeleton.tsx               # Loading skeleton
│   ├── hooks/                                # Custom React hooks
│   │   ├── use-drift-markets.ts              # Live Drift oracle data
│   │   ├── use-live-prices.ts                # PRNG price simulation
│   │   ├── use-game-program.ts               # Game adapter (local/on-chain)
│   │   ├── use-persistence.ts                # localStorage state sync
│   │   ├── use-theme-preferences.ts          # Theme management
│   │   ├── use-mobile.ts                     # Responsive breakpoint
│   │   ├── use-cursor-particles.ts           # Particle effect logic
│   │   ├── use-market-background.ts          # Dynamic background
│   │   └── use-price-simulation.ts           # Price tick generation
│   ├── lib/                                  # Business logic
│   │   ├── sentiment.ts                      # Sentiment analysis (PRNG + API)
│   │   ├── achievements.ts                   # Achievement definitions and logic
│   │   ├── affiliate.ts                      # Referral code generation
│   │   ├── game-adapter.ts                   # Game mode adapter pattern
│   │   ├── game-logic.ts                     # Game rules and resolution
│   │   ├── game-program.ts                   # Anchor program client
│   │   ├── themes.ts                         # Theme definitions
│   │   ├── presets.ts                        # UI presets
│   │   └── utils.ts                          # Shared utilities (cn, etc.)
│   ├── types/
│   │   └── index.ts                          # TypeScript type definitions
│   ├── idl/
│   │   └── bang_games.json                   # Anchor IDL for on-chain gaming
│   ├── test/
│   │   └── setup.ts                          # Vitest setup (JSDOM, mocks)
│   └── utils/
│       └── markets.ts                        # Market registry (SOL/BTC/ETH perps)
├── workers/
│   └── api/                                  # Cloudflare Worker API
│       ├── src/
│       │   ├── index.ts                      # Worker entry, CORS, routing
│       │   ├── routes/
│       │   │   ├── sentiment.ts              # /api/sentiment, /api/realities, /api/hashtags
│       │   │   └── affiliate.ts              # /api/affiliate/register, stats, track, leaderboard
│       │   └── lib/
│       │       ├── claude.ts                 # Anthropic Claude API client
│       │       ├── fallback.ts               # PRNG fallback generators
│       │       ├── prompts.ts                # Claude prompt templates
│       │       ├── cache.ts                  # KV cache helpers
│       │       └── rate-limit.ts             # Rate limiting middleware
│       ├── wrangler.toml                     # Worker config (KV bindings, secrets)
│       ├── package.json
│       └── tsconfig.json
├── programs/
│   └── bang-games/
│       └── src/
│           └── lib.rs                        # Anchor program scaffold (commented out)
├── docs/
│   ├── adr/                                  # Architectural Decision Records
│   ├── guides/                               # Architecture, deployment, features
│   ├── hiring-portfolio/                     # Portfolio presentation materials
│   └── ops/                                  # PR gardening, governance, operations
├── .github/workflows/
│   ├── ci.yml                                # Lint + typecheck + test
│   ├── deploy.yml                            # GitHub Pages deploy
│   ├── enhanced-pr-quality.yml               # PR quality checks
│   ├── profane-standards.yml                 # Content standards
│   ├── repository-health-check.yml           # Repo health monitoring
│   └── stale-management.yml                  # Stale issue/PR cleanup
├── there+back-again.md                       # Alpha-to-omega roadmap (this document's companion)
├── CHANGELOG.md                              # Version history
├── package.json                              # Dependencies and scripts (v3.0.0)
├── vite.config.ts                            # Vite + React + node polyfills
├── vitest.config.ts                          # Vitest configuration
├── tsconfig.json                             # TypeScript strict configuration
├── CODE_OF_CONDUCT.md                        # Community standards
├── CONTRIBUTING.md                           # Development workflow
├── SECURITY.md                               # Vulnerability reporting
└── LICENSE                                   # MIT
```

---

## Roadmap

See [`there+back-again.md`](./there+back-again.md) for the full alpha-to-omega roadmap.

### Current: v3.0.0 — Full-Stack Platform

Completed: 6-tab SPA with code splitting, 53 unit tests, Cloudflare Worker API scaffold (sentiment, affiliate, caching), Drift SDK integration hook (`useDriftMarkets`), on-chain gaming architecture (Anchor IDL + client adapter), 7 themes with glassmorphism, mobile responsive with bottom nav, achievement system, affiliate referral system.

### Next: Phases 1-4 — Wire-Up and Deployment

- Wire `useDriftMarkets` for live oracle data (Phase 1)
- Deploy Cloudflare Worker + Pages — first live URL (Phase 2)
- Activate Claude sentiment API (Phase 3)
- Wire affiliate tracking through real KV (Phase 4)

### Future: Phases 5-8 — Testing, Gaming, Security, Mainnet

- Expand test coverage to 80%+ with integration and E2E tests (Phase 5)
- Implement and deploy Anchor gaming program to devnet (Phase 6)
- Security hardening: CSP, Sentry, audit, rate limits (Phase 7)
- Mainnet launch with production RPC, Builder Code, and monitoring (Phase 8)

---

## Related Work

- [Drift Protocol](https://drift.trade) — The on-chain perpetual futures exchange this platform integrates with
- [Drift SDK](https://github.com/drift-labs/protocol-v2) — TypeScript SDK for Drift Protocol interaction
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) — Framework for Solana wallet integration in React
- [Drift Builder Code Documentation](https://docs.drift.trade/partnerships/DBC) — Revenue model documentation
- [Cloudflare Workers](https://workers.cloudflare.com/) — Edge-deployed API runtime

---

## Contributing

Contributions are welcome. Please read the [Contributing Guide](./CONTRIBUTING.md) for development workflow, code standards, and PR guidelines. See the [Code of Conduct](./CODE_OF_CONDUCT.md) for community expectations and the [Security Policy](./SECURITY.md) for vulnerability reporting.

```bash
# Fork the project, then:
git checkout -b feature/your-feature
# Make changes, write tests where applicable
npm run test:run  # Verify 53 tests pass
npm run build     # Verify build succeeds
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a Pull Request against main
```

---

## License

[MIT](./LICENSE) -- Copyright (c) 2025 4444JPP

---

## Author

**[@4444j99](https://github.com/4444j99)** -- Building commerce-grade products within the [organvm](https://github.com/meta-organvm) creative-institutional system. `trade-perpetual-future` is one of 21 repositories in [ORGAN-III: Ergon](https://github.com/organvm-iii-ergon), the commerce organ.
