# Planning Guide

A social perpetual futures exchange with live market data, PvP gaming, affiliate rewards, and community-driven liquidity where users fund each other through a peer-to-peer model rather than house banking.

**Experience Qualities**:
1. **Social & Competitive** - Community-driven trading with leaderboards, affiliate networks, and PvP games that transform trading into a social experience where users compete and collaborate
2. **Transparent & Fair** - Peer-to-peer funding model with complete transparency on liquidity sources, affiliate commissions, and game outcomes ensuring no house advantage
3. **Engaging & Rewarding** - Multiple earning paths through trading P&L, affiliate commissions, and PvP games with real-time feedback that celebrates wins and encourages strategic improvement

**Complexity Level**: Complex Application (advanced functionality with accounts)
  - User authentication, live market integration, affiliate tracking, PvP game engine, peer-to-peer order matching, social features, leaderboards, and comprehensive state management

## Essential Features

### User Authentication & Profile
- **Functionality**: GitHub OAuth sign-in with persistent user profiles tracking stats, P&L history, affiliate earnings, and game records
- **Purpose**: Enable personalized experience, social features, and affiliate tracking
- **Trigger**: Landing page with "Sign In with GitHub" prompt
- **Progression**: Click sign in → GitHub OAuth → Profile created → Dashboard loads with user stats
- **Success criteria**: User persists across sessions, profile displays cumulative stats, avatar and username shown

### Live Market Data & Charts
- **Functionality**: Real-time price updates with candlestick/line charts, order books, and 24h statistics from live crypto markets
- **Purpose**: Provide actual market conditions for realistic trading experience
- **Trigger**: Markets load on app init and update continuously
- **Progression**: Markets displayed → Select market → Chart renders with historical data → Updates in real-time
- **Success criteria**: Prices match external sources, charts display properly, updates are smooth without lag

### Perpetual Trading with Peer Liquidity
- **Functionality**: Open long/short positions matched against other users' counter-positions (user-vs-user liquidity model)
- **Purpose**: Enable real trading without house funding - users provide liquidity to each other
- **Trigger**: User enters trade with available balance
- **Progression**: Enter size & leverage → Submit order → Matched with counter-party → Position opens → P&L tracks against live prices
- **Success criteria**: Orders match correctly, P&L calculates accurately, liquidations trigger at proper prices

### Affiliate Program & Referral System
- **Functionality**: Generate unique referral links, track signups, earn commission on referred users' trading fees
- **Purpose**: Incentivize growth and reward community builders
- **Trigger**: User accesses "Affiliate" tab and generates link
- **Progression**: Create referral link → Share link → New user signs up via link → Referrer earns % of fees → Commission displayed in dashboard
- **Success criteria**: Links track correctly, commissions calculate properly, earnings are transparent and verifiable

### PvP Games (Dice, Coin Flip, Price Prediction)
- **Functionality**: Players wager on simple games - dice rolls, coin flips, or short-term price predictions against each other
- **Purpose**: Provide additional earning/entertainment beyond trading, increase engagement
- **Trigger**: User navigates to "Games" section and selects game type
- **Progression**: Choose game → Set wager → System matches with opponent or create challenge → Game executes → Winner receives pot minus small fee
- **Success criteria**: Games are provably fair, results verifiable, funds transfer correctly, no house advantage beyond small fee

### Leaderboard & Social Feed
- **Functionality**: Rankings by P&L, win rate, affiliate earnings; activity feed showing recent trades, big wins, referrals
- **Purpose**: Foster competition and community engagement
- **Trigger**: Users access Leaderboard tab
- **Progression**: View rankings → See top performers → Filter by category → View social activity
- **Success criteria**: Rankings update in real-time, stats are accurate, feed shows relevant activity

### Position Management & Liquidation Engine
- **Functionality**: Monitor positions, trigger liquidations when margin insufficient, redistribute liquidated collateral to counterparties
- **Purpose**: Manage risk and ensure system solvency through peer-funded model
- **Trigger**: Price movements causing margin to fall below maintenance
- **Progression**: Position approaches liquidation → Warning shown → Liquidation triggers → Counterparty receives collateral
- **Success criteria**: Liquidations execute correctly, no under-collateralized positions remain, funds distribute properly

## Edge Case Handling
- **Unauthenticated Access** - Show landing page with feature highlights and sign-in prompt; hide trading and games
- **Insufficient Balance** - Prevent trade submission and show clear error indicating required amount
- **No Matching Counterparty** - Queue order and show "Waiting for match" state with option to cancel
- **Network Connection Loss** - Detect disconnection, pause real-time updates, show reconnection banner
- **Invalid Referral Link** - Gracefully handle malformed links, still allow signup without referrer credit
- **Concurrent Position Updates** - Use optimistic locking to prevent race conditions in P&L calculations
- **Liquidation Edge Cases** - Handle partial liquidations, ensure atomic fund transfers, prevent negative balances
- **Game Result Disputes** - Store provably fair seeds and results for verification, provide resolution UI
- **Zero Liquidity Markets** - Display warning when insufficient counterparty liquidity available
- **Affiliate Self-Referral** - Detect and prevent users from earning commissions on their own accounts

## Design Direction
The design should feel like a premium social trading platform - professional yet accessible, competitive yet supportive. Think dark mode crypto exchange aesthetics merged with social media engagement patterns. Clean data visualization with bold accent colors for actions and achievements. Interface should feel alive with real-time updates while maintaining clarity. Rich interface better serves the multiple feature sets (trading, games, social, affiliate).

## Color Selection
Triadic color scheme with neon accents - Professional dark backgrounds with electric highlights for different action types, maintaining the crypto/gaming aesthetic while ensuring clear visual hierarchy.

- **Primary Color**: Electric Purple (`oklch(0.60 0.25 285)`) - Represents brand identity and primary actions with energy and modernity
- **Secondary Colors**: Deep slate (`oklch(0.15 0.02 260)`) for backgrounds creating depth and focus
- **Accent Colors**: 
  - Neon green (`oklch(0.75 0.20 145)`) for long positions, wins, and positive outcomes
  - Electric pink (`oklch(0.70 0.25 350)`) for short positions and negative P&L
  - Cyan blue (`oklch(0.70 0.20 220)`) for affiliate/social features
  - Amber gold (`oklch(0.75 0.20 70)`) for game features and achievements
- **Foreground/Background Pairings**:
  - Background (Deep slate `oklch(0.15 0.02 260)`): Light text (`oklch(0.95 0 0)`) - Ratio 13.2:1 ✓
  - Card (Slightly lighter `oklch(0.20 0.03 260)`): Light text (`oklch(0.95 0 0)`) - Ratio 10.8:1 ✓
  - Primary (Electric Purple `oklch(0.60 0.25 285)`): White text (`oklch(1 0 0)`) - Ratio 7.8:1 ✓
  - Long/Win (Neon green `oklch(0.75 0.20 145)`): Dark text (`oklch(0.15 0.02 260)`) - Ratio 10.5:1 ✓
  - Short/Loss (Electric pink `oklch(0.70 0.25 350)`): Dark text (`oklch(0.15 0.02 260)`) - Ratio 8.2:1 ✓
  - Affiliate (Cyan `oklch(0.70 0.20 220)`): Dark text (`oklch(0.15 0.02 260)`) - Ratio 8.9:1 ✓
  - Games (Amber `oklch(0.75 0.20 70)`): Dark text (`oklch(0.15 0.02 260)`) - Ratio 10.2:1 ✓

## Font Selection
Use Inter for primary UI and body text for excellent screen legibility, SF Pro for headings to match modern platform aesthetics, and JetBrains Mono for all numerical/financial data to ensure digit clarity.

- **Typographic Hierarchy**:
  - H1 (Main Title): SF Pro Bold/36px/tight tracking (-0.02em)
  - H2 (Section Headers): SF Pro SemiBold/24px/tight tracking (-0.01em)
  - H3 (Card Headers): Inter SemiBold/18px/normal tracking
  - Body (UI Labels): Inter Regular/14px/normal tracking (1.5 line height)
  - Price/Financial: JetBrains Mono Medium/varies by context/tight tracking
  - Micro (Captions): Inter Regular/12px/normal tracking/60% opacity
  - Stats Large: JetBrains Mono Bold/32px for key metrics
  - Username: Inter Medium/14px for consistent identity display

## Animations
Animations should communicate real-time activity, celebrate achievements, and provide continuous feedback for the live, social nature of the platform. Quick, purposeful animations that enhance understanding without slowing interactions.

- **Purposeful Meaning**: Real-time price tickers pulse on update, successful trades trigger celebration micro-animations, game wins show confetti burst, new referral signups show notification slide-in, position updates smoothly morph numbers
- **Hierarchy of Movement**: Critical alerts (liquidation warnings) use urgent shake animations, wins use upward slide with scale, live updates use subtle fade transitions, navigation uses smooth page transitions with directional context

## Component Selection
- **Components**: 
  - Card with multiple variants (trading, position, game, profile, affiliate stats)
  - Button variants (primary for trades, success for games/wins, outline for secondary actions)
  - Tabs for main navigation (Trade, Games, Leaderboard, Affiliate, Profile)
  - Dialog for game matches, trade confirmations, affiliate link generation
  - Avatar for user profiles throughout social features
  - Badge for user tiers, achievements, position types, leverage indicators
  - Table for leaderboards with sortable columns
  - Scroll Area for positions, history, social feed
  - Chart components from recharts for candlestick price charts
  - Progress bars for liquidation risk indicators
  - Separator for content divisions
  - Tooltip for hover explanations of complex features
  - Sheet for mobile drawer navigation
  - Toast for real-time notifications (trades, matches, referrals)
  
- **Customizations**: 
  - Live price ticker component with smooth number transitions
  - Candlestick chart with touch gestures for mobile
  - Game lobby cards with animated waiting states
  - Referral link generator with copy-to-clipboard
  - Social activity feed with infinite scroll
  - Liquidation risk meter with color-coded zones
  
- **States**: 
  - Buttons: Hover lift effect (translateY(-2px)), active press (scale 0.98), disabled reduced opacity with cursor-not-allowed
  - Cards: Hover elevation increase, selected state with accent border glow, pulse animation for real-time updates
  - Inputs: Focus with accent glow ring, error with destructive ring + shake animation, success with green checkmark
  - Live elements: Pulse effect on price updates (green/red based on direction), smooth number counter transitions
  
- **Icon Selection**: 
  - TrendUp/TrendDown for long/short and price movements
  - ChartLineUp for trading section
  - Dice/CoinVertical for game types  
  - Users/UsersThree for social/leaderboard
  - ShareNetwork for affiliate features
  - Lightning for leverage
  - WarningCircle for risk warnings
  - Trophy for leaderboard winners
  - CheckCircle for successful actions
  - X for closing/canceling
  
- **Spacing**: Base 4px unit with generous whitespace - 4/8/12/16/24/32px scale, cards with 20px padding, sections with 32px gaps, mobile reduces to 12/16/24px
- **Mobile**: 
  - Bottom tab navigation for main sections
  - Trading panel becomes bottom sheet
  - Charts support touch zoom/pan gestures  
  - Games in modal overlays
  - Leaderboard switches to card-based scrolling list
  - Collapsible header on scroll
  - Position cards stack vertically with swipe-to-close
