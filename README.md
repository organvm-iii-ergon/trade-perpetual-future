[![ORGAN-III: Ergon](https://img.shields.io/badge/ORGAN--III-Ergon-1b5e20?style=flat-square)](https://github.com/organvm-iii-ergon)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat-square&logo=solana&logoColor=white)](https://solana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

# trade-perpetual-future

[![CI](https://github.com/organvm-iii-ergon/trade-perpetual-future/actions/workflows/ci.yml/badge.svg)](https://github.com/organvm-iii-ergon/trade-perpetual-future/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-pending-lightgrey)](https://github.com/organvm-iii-ergon/trade-perpetual-future)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/organvm-iii-ergon/trade-perpetual-future/blob/main/LICENSE)
[![Organ III](https://img.shields.io/badge/Organ-III%20Ergon-F59E0B)](https://github.com/organvm-iii-ergon)
[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/organvm-iii-ergon/trade-perpetual-future)
[![TS+Python](https://img.shields.io/badge/lang-TS%2BPython-informational)](https://github.com/organvm-iii-ergon/trade-perpetual-future)


**A non-custodial perpetual futures trading platform on Solana, powered by Drift Protocol.**

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

`trade-perpetual-future` takes a different approach. It is a **thin client** — a React single-page application that connects users directly to [Drift Protocol](https://drift.trade), Solana's largest decentralized perpetual futures exchange. The platform:

- **Never custodies funds.** Users sign every transaction in their own wallet. Private keys never leave the browser extension.
- **Delegates all trading logic to audited smart contracts.** Order matching, liquidation, funding rates, and settlement all happen on-chain via Drift Protocol's program accounts.
- **Generates revenue without holding money.** The Drift Builder Code system attributes trades to the referring frontend and pays a percentage of protocol fees directly to the operator's wallet — no invoicing, no payment processing, no custodial risk.
- **Deploys as a static site.** No backend server, no database, no API layer. The entire application ships as HTML, JavaScript, and CSS to a CDN (GitHub Pages, Vercel, Netlify). Infrastructure cost approaches zero.

This architecture produces a product that is simultaneously simpler to operate, harder to attack, and more transparent than traditional alternatives.

### Core Capabilities

| Capability | Implementation |
|-----------|----------------|
| **Markets** | SOL-PERP, BTC-PERP, ETH-PERP (expandable via `markets.ts`) |
| **Order types** | Market, Limit, Stop Market |
| **Leverage** | 1x to 10x, visual slider control |
| **Position management** | Real-time open positions, one-click close, P&L tracking |
| **Account dashboard** | Total collateral, net USD value, unrealized P&L, current leverage |
| **Order history** | Full order lifecycle tracking with status filtering |
| **Analytics** | P&L breakdown (realized, unrealized, daily), trade counts |
| **Wallets** | Phantom, Solflare, UnsafeBurner (devnet testing) |
| **Data refresh** | Oracle prices every 2s, positions and orders every 5s |

---

## Why This Exists

Three motivations drive this project:

**1. Non-custodial DeFi needs better frontends.** Drift Protocol is a powerful on-chain exchange, but its official frontend serves a general audience. There is room for specialized trading interfaces — optimized for specific user segments, branded for specific distribution channels, or bundled into larger product suites. `trade-perpetual-future` demonstrates that a single developer can build and operate a compliant trading frontend with zero infrastructure cost.

**2. Revenue engineering without custody.** The Drift Builder Code model is a new primitive in crypto economics: a protocol-level referral system where revenue attribution happens entirely on-chain. This project explores what it means to build a profitable product that never touches user money — a pattern that extends well beyond crypto into any domain where protocol-level revenue sharing exists.

**3. Portfolio demonstration.** This is a fully functional financial product built with production-quality TypeScript, React, and blockchain integration. It demonstrates competence in: wallet adapter patterns, SDK integration, real-time data subscriptions, transaction construction, error handling under network uncertainty, and static deployment of complex client applications.

---

## Technical Architecture

The system follows a **stateless thin-client** pattern. There is no backend. All persistent state lives on-chain in Solana program accounts managed by Drift Protocol.

```
User's Browser
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  React SPA (Vite + TypeScript)                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │   App.tsx    │──│  TradePanel  │──│  PositionPanel    │   │
│  │  (root +    │  │  (orders +   │  │  (positions +     │   │
│  │   Drift     │  │   execution) │  │   close actions)  │   │
│  │   init)     │  └──────────────┘  └───────────────────┘   │
│  └─────────────┘  ┌──────────────┐  ┌───────────────────┐   │
│                   │  Dashboard   │  │  PnL Analytics    │   │
│                   │  Panel       │  │                   │   │
│                   └──────────────┘  └───────────────────┘   │
│                                                               │
│  Solana Wallet Adapter (React Context)                        │
│  ┌─────────────────┐  ┌──────────────────┐                   │
│  │ Phantom Adapter  │  │ Solflare Adapter │                   │
│  └─────────────────┘  └──────────────────┘                   │
│                                                               │
└───────────────────────────────────────┬───────────────────────┘
                                        │ JSON-RPC over HTTPS
                                        ▼
┌───────────────────────────────────────────────────────────────┐
│  Solana Blockchain                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Drift Protocol Smart Contracts                         │  │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ User Account │  │ Perp     │  │ Oracle (Pyth /   │  │  │
│  │  │ (collateral, │  │ Markets  │  │ Switchboard)     │  │  │
│  │  │  positions,  │  │ (AMM,    │  │                  │  │  │
│  │  │  orders)     │  │  order   │  │                  │  │  │
│  │  │              │  │  book)   │  │                  │  │  │
│  │  └──────────────┘  └──────────┘  └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow: Trade Execution

1. User selects market, enters amount, chooses leverage, picks order type (Market / Limit / Stop).
2. `TradePanel` computes position size (`amount * leverage`) and constructs Drift SDK order parameters.
3. For **Market orders**: `driftClient.placeAndTakePerpOrder()` creates and fills in a single atomic transaction.
4. For **Limit orders**: `getLimitOrderParams()` places a resting order at the specified price.
5. For **Stop Market orders**: `getTriggerMarketOrderParams()` places a trigger-conditional order (trigger below for longs, above for shorts).
6. The Drift SDK serializes the instruction, the wallet adapter prompts the user to sign, and the signed transaction is submitted to Solana via JSON-RPC.
7. On confirmation, the UI updates via polling (positions every 5 seconds, prices every 2 seconds).

### Data Flow: State Reads

- **Oracle prices**: `driftClient.getMMOracleDataForPerpMarket()` reads Pyth/Switchboard oracle accounts.
- **Bid/Ask**: `calculateBidAskPrice()` from the AMM state of the perp market account.
- **Positions**: `user.getActivePerpPositions()` reads the on-chain user account.
- **Account stats**: `user.getTotalCollateral()`, `user.getNetUsdValue()`, `user.getUnrealizedPNL()`, `user.getLeverage()` — all computed from on-chain state.

No data ever flows through a backend. The browser talks directly to Solana RPC nodes.

---

## System Components

### Frontend Layer

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Framework | React | 18.2.0 | Component rendering and state management |
| Language | TypeScript | 5.2.2 | Type-safe development across all modules |
| Build tool | Vite | 5.2.0 | ESM-native bundler with HMR and tree-shaking |
| Styling | Tailwind CSS + DaisyUI | 3.4.3 / 4.11.1 | Utility-first CSS with themed component library |
| Polyfills | vite-plugin-node-polyfills | 0.22.0 | Buffer/process shims for browser-side Solana SDK |

### Blockchain Layer

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Blockchain | Solana | — | Layer 1 settlement and program execution |
| RPC client | @solana/web3.js | 1.98.4 | Connection management, transaction submission |
| Wallet adapter | @solana/wallet-adapter-react | 0.15.39 | React context for wallet connection lifecycle |
| Trading SDK | @drift-labs/sdk-browser | 2.152.0-beta.2 | Drift Protocol client, order construction, account reads |

### Component Map

| File | Responsibility |
|------|----------------|
| `src/main.tsx` | Wallet provider setup (ConnectionProvider, WalletProvider, WalletModalProvider) |
| `src/App.tsx` | Root layout, Drift client initialization, user account subscription |
| `src/components/trading/TradePanel.tsx` | Order form: market/limit/stop, leverage slider, long/short execution |
| `src/components/trading/PositionPanel.tsx` | Active position table with one-click close |
| `src/components/trading/OrderHistory.tsx` | Order lifecycle tracking with status filters |
| `src/components/analytics/DashboardPanel.tsx` | Account stats: collateral, net value, unrealized P&L, leverage |
| `src/components/analytics/PnLAnalytics.tsx` | Performance dashboard: total/realized/unrealized P&L, trade counts |
| `src/components/common/RiskWarning.tsx` | Collapsible risk disclosure and terms of service |
| `src/components/common/Soothsayer.tsx` | Contextual guidance component |
| `src/utils/markets.ts` | Market registry: name, index, symbol for SOL/BTC/ETH perps |

---

## Installation and Quick Start

### Prerequisites

- **Node.js 18+** and npm (the project uses ESM modules via `"type": "module"`)
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

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_RPC_ENDPOINT` | `https://api.devnet.solana.com` | Solana RPC endpoint. For production, use a premium provider (QuickNode, Helius). |
| `VITE_DRIFT_ENV` | `devnet` | Drift environment. Set to `mainnet-beta` for real trading. |
| `VITE_DRIFT_BUILDER_CODE` | *(empty)* | Your Drift Builder Code public key for earning referral revenue. Register at [docs.drift.trade/partnerships/DBC](https://docs.drift.trade/partnerships/DBC). |

### Build for Production

```bash
# Type-check and build
npm run build

# Preview the production build locally
npm run preview
```

The output lands in `./dist/` — a fully static bundle ready for any CDN or static hosting provider.

---

## Usage Guide

### 1. Connect Your Wallet

Click **Select Wallet** in the navigation bar. Choose Phantom or Solflare. Approve the connection request in your wallet extension. The application will automatically initialize the Drift Protocol client and subscribe to your on-chain account.

### 2. Review Account Dashboard

Once connected, the dashboard displays four real-time metrics: **Total Collateral** (your deposited USDC), **Net USD Value** (total account value including open positions), **Unrealized P&L** (profit or loss on open positions), and **Current Leverage** (aggregate leverage across all positions). These values update from on-chain state.

### 3. Place a Trade

- **Select a market**: SOL-PERP, BTC-PERP, or ETH-PERP from the dropdown. Oracle price, bid, and ask update in real-time.
- **Choose an order type**: Market (instant fill), Limit (fill at your price or better), or Stop Market (trigger when price crosses your threshold).
- **Enter the amount** in USDC and set leverage from 1x to 10x using the slider.
- **Execute**: Click LONG (price up) or SHORT (price down). Your wallet will prompt you to sign the transaction.

### 4. Manage Positions

The **Position Panel** shows all active positions with market, direction, size, entry price, and live P&L. Click **Close** on any position to submit a reduce-only market order that exits the position entirely.

### 5. Review Order History

The **Orders** tab displays your full order lifecycle — open, filled, and cancelled orders with timestamps, sizes, and fill status. Use the filter buttons to narrow the view.

---

## Features

### Trading Engine

- **Three order types**: Market orders for immediate execution, limit orders for price-specific entries, and stop market orders for automated risk management via trigger conditions.
- **Configurable leverage**: 1x to 10x with a visual slider. Position size is calculated as `amount * leverage` and displayed in real-time before execution.
- **Multi-market support**: SOL-PERP, BTC-PERP, ETH-PERP out of the box. Adding a new market requires a single entry in `src/utils/markets.ts`.

### Real-Time Data

- **Oracle prices**: Pyth and Switchboard oracle feeds via the Drift SDK, refreshed every 2 seconds.
- **Bid/Ask spread**: Computed from the AMM state of each perp market account.
- **Position updates**: Active positions polled every 5 seconds with live P&L computation.
- **Dashboard metrics**: Collateral, net value, leverage, and unrealized P&L from on-chain user account state.

### Portfolio Analytics

- **P&L breakdown**: Total, realized, unrealized, and daily P&L with color-coded indicators (green for profit, red for loss).
- **Trade statistics**: Active position count and performance metrics.
- **Timeframe selection**: 1 Day, 1 Week, 1 Month, and All Time views.

### User Experience

- **Tab-based navigation**: Trade, Positions, Orders, and Analytics panels organized for workflow efficiency.
- **Dark theme**: DaisyUI-powered professional trading interface.
- **Responsive design**: Works on desktop and mobile browsers with touch-optimized controls.
- **Error feedback**: Clear status messages for transaction success, failure, and pending states.
- **Risk disclosures**: Collapsible terms of service and trading risk warnings.

---

## Configuration

### Adding a New Market

Edit `src/utils/markets.ts`:

```typescript
export const markets: Market[] = [
  { name: 'SOL-PERP', index: 0, marketIndex: 0, symbol: 'SOL' },
  { name: 'BTC-PERP', index: 1, marketIndex: 1, symbol: 'BTC' },
  { name: 'ETH-PERP', index: 2, marketIndex: 2, symbol: 'ETH' },
  // Add new markets here — marketIndex must match Drift Protocol's market index
  { name: 'RNDR-PERP', index: 3, marketIndex: 24, symbol: 'RNDR' },
]
```

The `marketIndex` values must correspond to Drift Protocol's on-chain market indices. Consult the [Drift documentation](https://docs.drift.trade/) for the current market list.

### Switching to Mainnet

Update `.env.local`:

```ini
VITE_RPC_ENDPOINT=https://your-premium-rpc-endpoint.com
VITE_DRIFT_ENV=mainnet-beta
VITE_DRIFT_BUILDER_CODE=your_builder_code_public_key
```

A premium RPC provider (QuickNode, Helius, Triton) is required for production use. The default Solana public RPC endpoint has aggressive rate limits that will degrade the trading experience.

---

## Architectural Decision Records

This project maintains formal ADRs in `docs/adr/`:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| [ADR-0001](./docs/adr/0001-use-blockchain-storage-instead-of-database.md) | Blockchain storage instead of database | Non-custodial architecture requires on-chain state; no backend means no database to host. Eliminates data breach risk entirely. |
| [ADR-0002](./docs/adr/0002-frontend-only-architecture.md) | Frontend-only without backend API | Smart contracts provide all business logic. No server means no custody, no single point of failure, and zero infrastructure cost beyond static hosting. Standard dApp pattern. |

These decisions are fundamental and non-reversible for core trading functionality. Optional backend services (analytics, notifications) could be added later without compromising the non-custodial guarantee.

---

## Security Model

The security architecture has four layers, each handled by a different system:

| Layer | System | What It Protects |
|-------|--------|------------------|
| **Private keys** | Wallet extension (Phantom/Solflare) | Keys never leave the browser extension. The application has no access to signing keys. |
| **Transaction authorization** | User signature | Every trade, position close, and order placement requires explicit user approval in the wallet UI. |
| **Trading logic** | Drift Protocol smart contracts | Order matching, liquidation, funding rates, and settlement are handled by audited on-chain programs. |
| **Settlement** | Solana blockchain | Proof of History + Proof of Stake consensus. Immutable transaction ledger with ~400ms block times. |

### What the Frontend Does NOT Do

- Does not store private keys or seed phrases
- Does not custody user funds at any point
- Does not run a backend server that could be compromised
- Does not store user data in any database (no data breach surface)
- Does not implement trading logic (all logic is on-chain)

### Attack Surface

| Vector | Risk Level | Mitigation |
|--------|-----------|------------|
| XSS | Low | React auto-escapes output; CSP headers in production |
| Supply chain | Medium | `npm audit` in CI; `package-lock.json` pinning; minimal dependency surface |
| Phishing / impersonation | Medium | Clear branding; wallet address verification; risk warnings |
| Smart contract exploit | Low | Using Drift Protocol, which is audited and battle-tested with >$1B in cumulative volume |
| Front-running | Medium | Inherent to public blockchains; Drift's AMM design mitigates via slippage protection |
| RPC endpoint compromise | Low | Users can configure their own RPC endpoint; premium providers offer authenticated access |

---

## Revenue Model

Revenue is generated through Drift Protocol's **Builder Code** system — a protocol-level referral mechanism:

1. **Register** for a Builder Code at [docs.drift.trade/partnerships/DBC](https://docs.drift.trade/partnerships/DBC).
2. **Configure** the code in `VITE_DRIFT_BUILDER_CODE`.
3. **Earn** 10-15% of trading fees from users who trade through your frontend.
4. **Revenue flows on-chain** — paid automatically to your wallet, no invoicing or payment processing.

This model is notable because it generates revenue without custodying funds, without collecting user data, and without running infrastructure beyond a CDN. The entire revenue pipeline is transparent and verifiable on-chain.

---

## Deployment

### GitHub Pages (Automated)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys on every push to `main`:

- Installs dependencies with `npm ci`
- Builds with `npm run build` (environment variables from repository secrets)
- Deploys the `dist/` directory to GitHub Pages

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

Drag the `dist/` folder into the Netlify UI, or connect the repository with build command `npm run build` and publish directory `dist`.

### Production Checklist

Before deploying to mainnet:

- [ ] Switch `VITE_DRIFT_ENV` to `mainnet-beta`
- [ ] Use a premium RPC endpoint (not the public devnet endpoint)
- [ ] Configure your Drift Builder Code for revenue attribution
- [ ] Test all order types (market, limit, stop) with real funds on a small scale
- [ ] Verify wallet connection and disconnection flows
- [ ] Set up error monitoring (Sentry or equivalent)
- [ ] Review jurisdiction-specific legal compliance for derivatives trading

---

## Cross-Organ Context

This repository operates within the [organvm](https://github.com/meta-organvm) eight-organ creative-institutional system:

| Relationship | Organ | Repository | Connection |
|-------------|-------|-----------|------------|
| **Theory** | [ORGAN-I: Theoria](https://github.com/organvm-i-theoria) | [recursive-engine](https://github.com/organvm-i-theoria/recursive-engine) | The epistemological framework that governs how systems observe and refine themselves. `trade-perpetual-future` embodies recursive product design: a thin client that delegates complexity to protocol-level primitives, then iterates on the interface layer. |
| **Orchestration** | [ORGAN-IV: Taxis](https://github.com/organvm-iv-taxis) | [agentic-titan](https://github.com/organvm-iv-taxis/agentic-titan) | The governance and routing layer for agent-driven workflows. The non-custodial architecture pattern demonstrated here — delegating execution to audited external systems while retaining control of the interface — is the same pattern `agentic-titan` applies to AI agent orchestration. |
| **Public Process** | [ORGAN-V: Logos](https://github.com/organvm-v-logos) | [public-process](https://github.com/organvm-v-logos/public-process) | The building-in-public narrative layer. Development decisions, architectural trade-offs, and revenue model analysis from this project feed into ORGAN-V essays. |

**Dependency direction**: ORGAN-I (theory) informs ORGAN-III (commerce) informs ORGAN-V (narrative). No back-edges: ORGAN-III does not depend on ORGAN-V or ORGAN-II.

---

## Project Structure

```
trade-perpetual-future/
├── src/
│   ├── main.tsx                              # Wallet provider setup (Connection, Wallet, Modal)
│   ├── App.tsx                               # Root component, Drift init, layout
│   ├── index.css                             # Global styles (Tailwind directives)
│   ├── vite-env.d.ts                         # TypeScript environment type declarations
│   ├── components/
│   │   ├── trading/
│   │   │   ├── TradePanel.tsx                # Order form: market/limit/stop execution
│   │   │   ├── PositionPanel.tsx             # Active positions with close actions
│   │   │   └── OrderHistory.tsx              # Order lifecycle tracking
│   │   ├── analytics/
│   │   │   ├── DashboardPanel.tsx            # Account statistics (collateral, PnL, leverage)
│   │   │   └── PnLAnalytics.tsx              # Performance dashboard
│   │   └── common/
│   │       ├── RiskWarning.tsx               # Terms of service and risk disclosures
│   │       └── Soothsayer.tsx                # Contextual guidance
│   └── utils/
│       └── markets.ts                        # Market registry (SOL/BTC/ETH perp configs)
├── docs/
│   ├── adr/                                  # Architectural Decision Records
│   ├── guides/                               # Architecture, deployment, features, roadmap
│   ├── hiring-portfolio/                     # Portfolio presentation materials
│   └── ops/                                  # PR gardening, governance, operational docs
├── scripts/
│   └── video_production/                     # Python video production pipeline
├── .github/workflows/
│   ├── deploy.yml                            # GitHub Pages CI/CD
│   ├── enhanced-pr-quality.yml               # PR quality checks
│   ├── profane-standards.yml                 # Content standards enforcement
│   ├── repository-health-check.yml           # Repo health monitoring
│   └── stale-management.yml                  # Stale issue/PR cleanup
├── .env.example                              # Environment variable template
├── package.json                              # Dependencies and scripts
├── vite.config.ts                            # Vite + React + node polyfills
├── tsconfig.json                             # TypeScript strict configuration
├── tailwind.config.js                        # Tailwind + DaisyUI theme
├── postcss.config.js                         # PostCSS pipeline
├── CODE_OF_CONDUCT.md                        # Community standards
├── CONTRIBUTING.md                           # Development workflow and PR guidelines
├── SECURITY.md                               # Vulnerability reporting policy
└── LICENSE                                   # MIT
```

---

## Roadmap

### Current: v2.0 — Professional Trading Platform

Completed: Market/Limit/Stop orders, real-time oracle prices, position management with one-click close, account dashboard, P&L analytics, order history with filtering, tab-based navigation.

### Next: v2.x — Chart Integration and Order Management

- TradingView chart integration for technical analysis
- Cancel and modify open orders
- Historical P&L charts with time-series visualization
- Export trade history to CSV

### Future: v3.x — Social and Advanced Features

- Advanced order types (OCO, trailing stop)
- Social trading and copy-trade functionality
- Leaderboard system
- Mobile application (React Native)
- Multi-chain expansion beyond Solana

---

## Related Work

- [Drift Protocol](https://drift.trade) — The on-chain perpetual futures exchange this platform integrates with
- [Drift SDK](https://www.npmjs.com/package/@drift-labs/sdk) — TypeScript SDK for Drift Protocol interaction
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) — Framework for Solana wallet integration in React
- [Drift Builder Code Documentation](https://docs.drift.trade/partnerships/DBC) — Revenue model documentation

---

## Contributing

Contributions are welcome. Please read the [Contributing Guide](./CONTRIBUTING.md) for development workflow, code standards, and PR guidelines. See the [Code of Conduct](./CODE_OF_CONDUCT.md) for community expectations and the [Security Policy](./SECURITY.md) for vulnerability reporting.

```bash
# Fork the project, then:
git checkout -b feature/your-feature
# Make changes, write tests where applicable
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
