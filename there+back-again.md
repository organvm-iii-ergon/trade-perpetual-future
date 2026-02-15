# there+back-again.md — Alpha to Omega Roadmap

> Bang Perp Exchange: from working prototype to production trading platform.
> Written against commit `07a7681` (v3.0.0) on 2026-02-15.

---

## MACRO I — Alpha Assessment

### What Works

The v3.0.0 codebase is a functional single-page application with genuine depth:

- **Six-tab SPA** — Dashboard, Markets, Trading, Games, Social, Settings. Code-split via `React.lazy()` with `TabSkeleton` fallbacks.
- **53 unit tests** passing (Vitest + Testing Library): sentiment PRNG, achievements, affiliate logic, game logic, persistence hook, error boundary.
- **Drift SDK integration** — `DriftClient` initializes on wallet connect, reads perp/spot market accounts, subscribes to user account, executes market/limit/stop orders through `TradePanel`.
- **PRNG market simulation** — `useLivePrices` generates realistic price ticks at 3s intervals when no wallet is connected, with session highs/lows and price history buffers.
- **Gaming system** — Coin flip, dice roll, prediction games with local-state adapter. Achievements engine (15 achievements, badge progression). Leaderboard UI. `useGameProgram` hook switches between localStorage and on-chain adapters.
- **Affiliate system** — Referral code generation, stats tracking, leaderboard. All client-side via `usePersistence`.
- **Social features** — Hashtag sentiment panel, affiliate tab, sign-in page, user profile display.
- **Personalization** — 7 DaisyUI themes (runtime switching), glassmorphism glass panels, dynamic market-driven backgrounds, cursor particle effects (toggleable).
- **Mobile responsive** — `useIsMobile` hook, `MobileNav` bottom tab bar, responsive layouts throughout.
- **Cloudflare Worker scaffold** — Complete API with 6 route handlers (sentiment analysis, realities generation, hashtag analysis, affiliate register/stats/track/leaderboard), Claude API client, PRNG fallback, KV caching, rate limiting.
- **On-chain gaming architecture** — Anchor IDL (`bang_games.json`), client adapter (`game-adapter.ts`), program client (`game-program.ts`). Switchboard VRF design documented.
- **CI/CD** — GitHub Actions CI (lint + typecheck + test), deploy workflow, PR quality checks, Dependabot, stale management.

### What's Scaffold (Coded but Not Live)

| Component | Status | What's Missing |
|-----------|--------|---------------|
| **Cloudflare Worker** | Full source in `workers/api/`. Routes, caching, rate limiting, Claude client all coded. | KV namespace IDs are `placeholder-*` in `wrangler.toml`. Never deployed. No `ANTHROPIC_API_KEY` secret set. |
| **Drift market hook** | `useDriftMarkets` exists at `src/hooks/use-drift-markets.ts`. Reads oracle data, computes price/volume/OI/funding from on-chain accounts. | Not wired into `App.tsx`. The app still uses `useLivePrices(DEFAULT_SIM_MARKETS)` for PRNG data. |
| **Anchor program** | `programs/bang-games/src/lib.rs` has the full program structure commented out. IDL and client adapter ready. | Entirely commented-out Rust. Needs `anchor build`, VRF integration, devnet deploy. |
| **Affiliate backend** | Worker routes handle register, stats, track-trade, leaderboard via KV. | No KV namespaces created. Client never calls Worker endpoints — all localStorage. |

### What's Missing Entirely

- **No production deployment.** No live URL. No Cloudflare Pages project. No DNS.
- **No real Claude API calls.** Sentiment analysis is pure PRNG. Worker has the integration but isn't deployed.
- **Affiliate not wired to wallet.** `generateReferralCode('anon')` is hardcoded — should use wallet pubkey.
- **Achievements not polling positions.** Achievement triggers are in gaming only — not connected to real trading activity.
- **No `?ref=` URL parsing.** Affiliate link tracking requires reading referral codes from URL params.
- **No error monitoring.** No Sentry, no Datadog, no structured error reporting.
- **No branch protection.** `main` branch is unprotected.
- **No CSP headers** in production.
- **No PWA manifest.** No service worker, no offline support.

---

## MICRO — Eight Phases

### Phase 1: Foundation Wire-Up

**Goal:** Connect existing code that's been built but not wired together. Pure code changes, no infrastructure.

**Tasks:**

1. **Wire `useDriftMarkets` into App.tsx**
   - Replace `useLivePrices(DEFAULT_SIM_MARKETS)` with `useDriftMarkets(driftClient)`.
   - When `driftClient` is null (no wallet), `useDriftMarkets` returns empty array — fall back to PRNG.
   - When connected, UI shows real Drift oracle prices instead of simulated data.

2. **Wire affiliate to wallet pubkey**
   - Replace `generateReferralCode('anon')` with `generateReferralCode(publicKey?.toBase58() ?? 'anon')`.
   - Affiliate referral code becomes wallet-derived, enabling consistent tracking.

3. **Wire `?ref=` URL parsing**
   - On mount, check `URLSearchParams` for `ref` param.
   - Store in localStorage as `referred-by`.
   - Pass to Worker `track-trade` endpoint in future phases.

4. **Wire achievement triggers to position events**
   - When `simPositions` changes (position opened/closed), check achievement conditions.
   - Unlock "First Trade", "Win Streak", etc. based on position outcomes.

**Acceptance criteria:**
- `npm run build` passes.
- `npm run test:run` passes (53 tests, no regressions).
- When wallet connected to Drift devnet, Markets tab shows real oracle prices.
- Referral code changes when different wallet connects.

**Files touched:** `src/App.tsx`, `src/components/social/AffiliateTab.tsx` (if ref parsing lives here)

---

### Phase 2: Cloudflare Deployment

**Goal:** First live URL. Deploy Worker API and Pages frontend.

**Tasks:**

1. **Create Cloudflare account resources**
   ```bash
   wrangler kv:namespace create SENTIMENT_CACHE
   wrangler kv:namespace create AFFILIATE_KV
   wrangler kv:namespace create SENTIMENT_CACHE --preview
   wrangler kv:namespace create AFFILIATE_KV --preview
   ```
   Update `wrangler.toml` with real namespace IDs.

2. **Deploy Worker**
   ```bash
   cd workers/api
   wrangler deploy
   ```
   Verify routes respond: `curl https://bang-perp-api.<subdomain>.workers.dev/api/health`

3. **Create Cloudflare Pages project**
   ```bash
   wrangler pages project create bang-perp-exchange
   ```
   Configure build: `npm run build`, output `dist/`, env vars for `VITE_RPC_ENDPOINT`, `VITE_DRIFT_ENV`, `VITE_API_BASE`.

4. **Deploy frontend**
   ```bash
   npm run build
   wrangler pages deploy dist/
   ```

5. **Configure custom domain** (optional, can use `*.pages.dev` for now).

6. **Update `VITE_API_BASE`** in Pages environment to point to Worker URL.

**Acceptance criteria:**
- Worker API returns JSON at `/api/health`.
- Frontend loads at `*.pages.dev` URL.
- Wallet connect works on live site.
- PRNG markets display correctly (Claude API not yet active).

**Files touched:** `workers/api/wrangler.toml`, `.env.example` (document production URL pattern)

---

### Phase 3: Claude API Activation

**Goal:** Sentiment analysis powered by real Claude API calls instead of PRNG.

**Tasks:**

1. **Set Anthropic API key**
   ```bash
   cd workers/api
   wrangler secret put ANTHROPIC_API_KEY
   ```

2. **Test sentiment endpoint**
   ```bash
   curl -X POST https://bang-perp-api.<subdomain>.workers.dev/api/sentiment \
     -H 'Content-Type: application/json' \
     -d '{"symbol": "SOL-PERP"}'
   ```
   Verify response contains `score`, `signal`, `summary` from Claude.

3. **Test realities and hashtags endpoints** similarly.

4. **Verify fallback path** — When rate-limited or Claude errors, Worker should return PRNG fallback data from `src/lib/fallback.ts`.

5. **Wire frontend to Worker** — Update sentiment calls in `src/lib/sentiment.ts` to fetch from `VITE_API_BASE` when available, fall back to PRNG when not.

6. **Monitor KV cache** — Sentiment responses should cache in `SENTIMENT_CACHE` KV with TTL. Verify cache hits via Cloudflare dashboard.

**Acceptance criteria:**
- Sentiment endpoint returns Claude-generated analysis.
- KV cache prevents redundant Claude API calls (same symbol within TTL).
- Rate limit returns 429 with fallback data.
- Frontend displays Claude-generated sentiment when API is available.
- Total Claude API cost stays under $5/day at expected traffic levels.

**Files touched:** `src/lib/sentiment.ts` (add API fetch path), `workers/api/src/lib/claude.ts` (verify prompt tuning)

---

### Phase 4: Affiliate Backend Live

**Goal:** Affiliate tracking through real KV storage via the Worker API.

**Tasks:**

1. **Test affiliate registration**
   ```bash
   curl -X POST https://bang-perp-api.<subdomain>.workers.dev/api/affiliate/register \
     -H 'Content-Type: application/json' \
     -d '{"walletAddress": "..."}'
   ```

2. **Test stats retrieval, trade tracking, and leaderboard** endpoints.

3. **Wire frontend affiliate calls** — Replace localStorage-only affiliate logic with Worker API calls (with localStorage as offline fallback).

4. **Wire `?ref=` tracking** — When a user arrives via `?ref=CODE`, the frontend sends the referral to the Worker on first trade.

5. **Leaderboard hydration** — Replace the PRNG-generated leaderboard in App.tsx with real leaderboard data from the Worker.

**Acceptance criteria:**
- Affiliate registration persists in KV.
- Trade tracking increments referrer stats.
- Leaderboard reflects real data.
- Offline/disconnected state falls back to localStorage gracefully.

**Files touched:** `src/lib/affiliate.ts`, `src/App.tsx` (leaderboard), `src/components/social/AffiliateTab.tsx`

---

### Phase 5: Test Coverage Expansion

**Goal:** 80%+ test coverage. Integration tests for API routes. E2E smoke test.

**Tasks:**

1. **Add Worker integration tests** — Use Miniflare (Cloudflare's local simulator) to test:
   - Sentiment route (with/without cache)
   - Affiliate registration and stats
   - Rate limiting behavior
   - Fallback paths

2. **Add component integration tests** — Test tab rendering, wallet mock scenarios, market data display.

3. **Add E2E smoke test** — Playwright test that:
   - Loads the app
   - Verifies 6 tabs render
   - Clicks through each tab
   - Verifies no console errors

4. **Configure coverage reporting** — `vitest run --coverage` with V8 provider. Add coverage badge to README.

5. **Add to CI** — Integration tests and E2E run in GitHub Actions.

**Acceptance criteria:**
- `npm run test:coverage` reports 80%+ line coverage.
- Miniflare integration tests pass in CI.
- Playwright E2E smoke test passes.
- Coverage badge in README shows real number.

**New files:** `workers/api/test/`, `e2e/`, `playwright.config.ts`

---

### Phase 6: Anchor Program Development

**Goal:** Uncomment and implement the on-chain gaming program. Deploy to devnet.

**Tasks:**

1. **Set up Anchor workspace**
   ```bash
   anchor init bang-games --no-git
   ```
   Move existing `programs/bang-games/src/lib.rs` into the Anchor project.

2. **Implement program instructions**
   - `initialize_house` — Create house account, set fee percentage.
   - `create_game` — Create game PDA, escrow wager.
   - `join_game` — Second player joins, escrow their wager.
   - `settle_game` — Determine winner (VRF for randomness), pay out.
   - `cancel_game` — Return funds if no opponent joined.
   - `claim_fees` — House operator withdraws accumulated fees.

3. **Integrate Switchboard VRF** — For provably fair randomness in coin flip and dice games.

4. **Build and deploy to devnet**
   ```bash
   anchor build
   anchor deploy --provider.cluster devnet
   ```

5. **Update IDL** — Replace `src/idl/bang_games.json` with the generated IDL.

6. **Update client adapter** — Switch `game-adapter.ts` to use real program calls when wallet connected.

7. **Write program tests** — Anchor's TypeScript test framework (`anchor test`).

**Acceptance criteria:**
- `anchor build` succeeds.
- Program deploys to devnet.
- Coin flip game works end-to-end with real SOL (devnet).
- VRF integration provides verifiable randomness.
- Client adapter seamlessly switches between local and on-chain modes.

**Files touched:** `programs/bang-games/src/lib.rs`, `src/idl/bang_games.json`, `src/lib/game-adapter.ts`, `src/lib/game-program.ts`, `Anchor.toml`

---

### Phase 7: Security Hardening

**Goal:** Production security posture.

**Tasks:**

1. **CSP headers** — Add Content-Security-Policy to Cloudflare Pages via `_headers` file. Restrict script-src, connect-src to known origins.

2. **npm audit** — Resolve all high/critical vulnerabilities. Add `npm audit --audit-level=high` to CI.

3. **Sentry integration** — Add `@sentry/react` for frontend error tracking. Configure DSN via env var.

4. **Rate limit tuning** — Adjust Worker rate limits based on real traffic patterns. Add IP-based limiting.

5. **Drift Builder Code configuration** — Register for production Builder Code. Set `VITE_DRIFT_BUILDER_CODE` in Pages environment.

6. **Subresource integrity** — SRI hashes on critical CDN resources if any.

7. **Wallet security review** — Verify no signing requests happen without explicit user action. Audit all `signTransaction` call sites.

8. **Dependency review** — Audit `@drift-labs/sdk-browser` for known issues. Pin exact versions for critical deps.

**Acceptance criteria:**
- CSP blocks unauthorized script execution.
- `npm audit` shows 0 high/critical vulnerabilities.
- Sentry captures and reports frontend errors.
- Rate limiting prevents API abuse.
- Security review checklist completed and documented.

**New files:** `public/_headers`, `.sentryclirc` (gitignored)

---

### Phase 8: Mainnet Launch

**Goal:** Real money, real users.

**Tasks:**

1. **Switch Drift environment**
   - Set `VITE_DRIFT_ENV=mainnet-beta` in Cloudflare Pages.
   - Set `VITE_RPC_ENDPOINT` to premium RPC (QuickNode or Helius).

2. **Configure production Builder Code** — Real `VITE_DRIFT_BUILDER_CODE` that routes protocol fees to operator wallet.

3. **Production RPC** — Premium endpoint with authentication. Configure connection pooling and fallback.

4. **Monitoring setup**
   - Sentry alerts for error spikes.
   - Cloudflare analytics for traffic.
   - Worker analytics for API latency.
   - Uptime monitoring (UptimeRobot or similar).

5. **Legal review** — Derivatives trading compliance. Geo-blocking if required. Terms of service update.

6. **Launch checklist**
   - [ ] All tests pass on main.
   - [ ] Worker deployed with real KV and secrets.
   - [ ] Pages deployed with mainnet env vars.
   - [ ] Builder Code active and earning.
   - [ ] Sentry receiving events.
   - [ ] RPC endpoint stable under load.
   - [ ] Risk disclosures visible and accurate.
   - [ ] Domain configured with SSL.

7. **Branch protection** — Require PR reviews, status checks pass, no force push on `main`.

**Acceptance criteria:**
- Live URL serves mainnet trading interface.
- First real trade executes successfully.
- Builder Code revenue appears in operator wallet.
- Error monitoring captures issues in real-time.
- <$50/month infrastructure cost at launch traffic levels.

---

## MACRO II — Omega Definition

### The Nine Gates

The system is "done" (omega) when all nine gates pass:

| # | Gate | Criteria |
|---|------|----------|
| 1 | **Tests** | All unit, integration, and E2E tests pass. 80%+ coverage. |
| 2 | **API** | All 6 Worker routes live and returning real data. |
| 3 | **Anchor** | Gaming program deployed to devnet. At least one game type works end-to-end. |
| 4 | **Drift Live** | UI shows real Drift oracle data when wallet connected. |
| 5 | **Affiliate** | Referral tracking works through real KV. Leaderboard reflects real data. |
| 6 | **Sentiment** | Claude-generated sentiment displayed in Markets tab. |
| 7 | **Mobile** | PWA-installable. All tabs usable on mobile viewports. |
| 8 | **Monitoring** | Sentry capturing errors. Uptime checks green. |
| 9 | **Revenue** | Builder Code active. First protocol fee captured. |

### What "Done" Does NOT Mean

These are explicitly out of scope for omega (v3.x). They belong to v4+:

- **Mainnet Anchor program.** Devnet is sufficient. Mainnet requires a security audit (~$50K+).
- **Mobile native app.** React Native port is v4+. PWA covers mobile for now.
- **Multi-chain expansion.** Solana only. No EVM bridges.
- **Copy-trading / social trading.** Requires significant backend infrastructure.
- **TradingView charts.** Requires licensing or self-hosting. PRNG price charts are sufficient for v3.
- **Advanced order types** (OCO, trailing stop). Drift SDK supports them, but UI complexity isn't justified yet.

### Success Metrics

| Metric | Target |
|--------|--------|
| Initial page load | < 2 seconds (Lighthouse) |
| Test coverage | > 80% line coverage |
| Monthly infrastructure cost | < $50 (Worker + Pages + KV + RPC) |
| Sentiment API p95 latency | < 500ms (with KV cache hits) |
| Error rate | < 0.1% of page loads |
| Builder Code revenue | > $0 (proving the model works) |

### Timeline Estimate

These phases are not calendar-bound — they're ordered by dependency. A solo developer working evenings could complete Phases 1-4 in 2-4 weeks. Phases 5-8 could take another 4-8 weeks depending on Anchor complexity and legal review timing. The critical path is: Phase 1 → Phase 2 → Phase 3 → Phase 8. Gaming (Phase 6) is a parallel track.

---

*This document is the master roadmap. Update it as phases complete. When all nine gates pass, the system has reached omega.*
