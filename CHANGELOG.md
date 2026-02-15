# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2026-02-15

### Added

- **Test infrastructure**: 53 unit tests (Vitest + Testing Library) covering sentiment PRNG, achievements, affiliate logic, game logic, persistence hook, error boundary
- **Code splitting**: `React.lazy()` for all 6 tab components with `TabSkeleton` loading fallbacks
- **Cloudflare Worker API** (`workers/api/`): 6 route handlers — sentiment analysis, realities generation, hashtag analysis, affiliate register/stats/track-trade/leaderboard. Includes Claude API client, PRNG fallback, KV caching, rate limiting
- **On-chain gaming architecture**: Anchor program scaffold (`programs/bang-games/`), IDL (`bang_games.json`), client adapter with localStorage/on-chain mode switching, game program client
- **Drift market hook**: `useDriftMarkets` reads real oracle prices, volume, open interest, and funding rates from Drift on-chain accounts
- **Mobile responsiveness**: `useIsMobile` hook, `MobileNav` bottom tab bar, responsive layouts across all tabs
- **Gaming system**: Coin flip, dice roll, prediction games. 15 achievements with badge progression. Leaderboard UI
- **Social features**: Hashtag sentiment panel, affiliate tab with referral code generation, sign-in page, user profiles
- **Personalization**: Dynamic market-driven backgrounds, cursor particle effects (toggleable), glassmorphism glass panels
- **CI/CD**: Vitest in CI workflow, coverage configuration (`@vitest/coverage-v8`)
- **Platinum Sprint**: CI/CD workflow template, standardized badge row, 2 ADR documents

### Changed

- Upgraded to React 19, TypeScript 5.7, Vite 6.3, Tailwind CSS 4.1, DaisyUI 5.0
- Architecture evolved from stateless thin client to full-stack (React SPA + Cloudflare Worker API)
- Replaced single-theme dark UI with 7 switchable DaisyUI themes

## [2.0.0] - 2026-02-14

### Added

- **Six-tab UI**: Dashboard, Markets, Trading, Games, Social, Settings — replacing the original 4-tab layout (Trade, Positions, Orders, Analytics)
- **Sentiment engine**: PRNG-based sentiment analysis with score/signal/summary generation, reality scenarios, hashtag trends, alert detection
- **Achievement system**: 15 unlockable achievements with badge tiers (bronze/silver/gold/platinum), notification toasts
- **Affiliate system**: Client-side referral code generation, stats tracking, commission calculation, leaderboard
- **7 themes**: Runtime theme switching via DaisyUI (dark, light, cyberpunk, synthwave, dracula, night, luxury)
- **Glassmorphism design**: `glass-strong`, `glass-card` utility classes, backdrop blur panels, gradient text animations
- **Market simulation**: `useLivePrices` hook with PRNG price ticks, session highs/lows, 100-point price history buffers
- **Trading panel**: Market/limit/stop order forms with leverage slider, position management, order history
- **Tab persistence**: `usePersistence` hook saves active tab, watchlist, positions, game state to localStorage

### Changed

- Merged Spark prototype branch into production (`bf97a57`)
- Expanded component count from 7 to 37+ across 9 directories

## [0.1.0] - 2026-02-11

### Added

- Initial public release as part of the organvm eight-organ system
- Core project structure and documentation
- README with portfolio-quality documentation

[Unreleased]: https://github.com/organvm-iii-ergon/trade-perpetual-future/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/organvm-iii-ergon/trade-perpetual-future/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/organvm-iii-ergon/trade-perpetual-future/compare/v0.1.0...v2.0.0
[0.1.0]: https://github.com/organvm-iii-ergon/trade-perpetual-future/releases/tag/v0.1.0
