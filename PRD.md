# Planning Guide

A comprehensive trading and sentiment platform that combines perpetual futures trading, AI-powered market sentiment analysis with multi-reality projections, PvP gaming, and affiliate revenue features - all in a sleek glassmorphic interface.

**Experience Qualities**:
1. **Intelligent & Predictive** - AI-driven sentiment analysis projects multiple parallel market realities, helping traders visualize potential outcomes with real-time alerts for downtrends and volatility
2. **Interactive & Engaging** - Glassmorphic UI with cursor particle effects, smooth color transitions, and animated gaming experiences that make trading and analysis feel alive and responsive
3. **Community-Driven & Rewarding** - Affiliate program with referral tracking, PvP games for entertainment, leaderboards for competition, creating a social trading ecosystem

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Multiple integrated systems: perpetual trading, sentiment analysis, gaming, affiliate tracking, real-time price feeds, position management, and social features with persistent user data

## Essential Features

### AI Sentiment Analysis & Reality Projections
- **Functionality**: Analyze market sentiment from social data and project 3-5 parallel market realities showing different potential outcomes over the next 7 days
- **Purpose**: Help traders understand sentiment and visualize range of possibilities rather than single predictions
- **Trigger**: User selects a symbol from watchlist or adds new symbol
- **Progression**: Symbol selected → AI analyzes sentiment → Projects parallel realities → Each shows price path with probability → Updates every 5 minutes → Downtrend alerts fire if sentiment drops
- **Success criteria**: Multiple distinct realities render, probabilities realistic, alerts fire within 30s of threshold breach

### Perpetual Futures Trading (Demo Mode)
- **Functionality**: Long/short positions on crypto perpetuals with leverage, live price feeds, P&L tracking, position management
- **Purpose**: Core trading functionality allowing users to practice strategies without real funds
- **Trigger**: User navigates to Trading tab, selects market
- **Progression**: Select market → Choose long/short → Set size and leverage → Confirm trade → Position opens → Real-time P&L updates → Close position manually or via liquidation
- **Success criteria**: Trades execute instantly, P&L calculates correctly, liquidation prices accurate, positions persist across sessions

### PvP Gaming Arena
- **Functionality**: Dice roll, coin flip, and price prediction games where users wager against each other
- **Prgression**: Select game type → Set wager → Create game → Opponent joins → Game executes → Winner determined → Funds transferred
- **Purpose**: Entertainment and community engagement between trading sessions
- **Trigger**: User clicks Games tab
- **Progression**: Select game type → Set wager → Create lobby → Wait for opponent → Game executes with animation → Result shown → Winner takes pot minus fee
- **Success criteria**: Games complete in <5 seconds, animations engaging, results provably fair, balance updates instantly

### Affiliate Revenue System
- **Functionality**: Generate referral codes, track referrals, earn commissions on trading fees, view leaderboards
- **Purpose**: Incentivize user growth and reward community builders
- **Trigger**: User views Affiliate tab
- **Progression**: View referral code → Share with others → New users sign up with code → They trade → Commissions earned → View in dashboard
- **Success criteria**: Referral tracking accurate, commission calculations correct, leaderboard updates in real-time

### Hashtag Trend Analysis
- **Functionality**: Track trending hashtags related to symbols, analyze sentiment, show volume and momentum changes
- **Purpose**: Surface what traders discuss and identify sentiment shifts
- **Trigger**: User selects symbol and views Hashtags tab
- **Progression**: Symbol selected → Hashtags analyzed → Scored for sentiment → Ranked by volume and change → Displayed with trend indicators
- **Success criteria**: Hashtags feel realistic, sentiment matches tone, updates every minute

### Real-Time Market Dashboard
- **Functionality**: Live price charts, 24h changes, volume, open interest, funding rates across multiple markets
- **Purpose**: Central overview of market conditions
- **Trigger**: User opens Markets tab
- **Progression**: Dashboard loads → Prices stream in → Charts update → User can click to trade
- **Success criteria**: Prices update smoothly without lag, charts responsive, data accurate

## Edge Case Handling
- **Invalid Symbol Entry** - Autocomplete suggestions, validate against known tickers, graceful error messages
- **Insufficient Balance** - Disable trade/game buttons, show clear messaging, suggest deposit (in real app)
- **Network Failures** - Gracefully degrade to cached data, show staleness indicators, retry logic
- **Extreme Volatility** - Cap probability ranges, show volatility warnings, adjust liquidation calculations
- **Alert Fatigue** - Group rapid alerts, cooldown periods, adjustable sensitivity settings
- **Game Disconnections** - Auto-refund on timeouts, show connection status, grace period for rejoin
- **Concurrent Position Limits** - Warn at limit, prevent opening new positions, clear messaging
- **Zero Balance State** - Show welcome message, explain demo mode, guide to first actions

## Design Direction
The design should feel like a futuristic trading terminal with Apple-like refinement - glassmorphic surfaces that layer and interact, smooth animations that guide attention, and vibrant accent colors that communicate urgency or success. Dark theme with deep space backgrounds, glowing elements, and translucent panels create depth. Every interaction should feel responsive and delightful while maintaining analytical clarity.

## Color Selection
Custom palette with dark base and vibrant accents - Deep space aesthetic with glassmorphic layers, neon highlights for actions, and semantic colors for long/short positions and alerts.

- **Primary Color**: Deep Space Blue (`oklch(0.20 0.08 250)`) - Main brand color for primary actions and navigation
- **Secondary Colors**: 
  - Slate (`oklch(0.30 0.08 250)`) for card backgrounds with glass effect
  - Muted Blue (`oklch(0.35 0.06 250)`) for secondary surfaces
- **Accent Colors**:
  - **Long/Bullish** (`oklch(0.75 0.22 150)`) - Green for long positions and bullish sentiment
  - **Short/Bearish** (`oklch(0.70 0.25 10)`) - Red for short positions and bearish sentiment
  - **Cyan Highlight** (`oklch(0.70 0.15 200)`) - Interactive elements and focus states
  - **Amber** (`oklch(0.75 0.18 70)`) - Gaming elements and rewards
  - **AI Purple** (`oklch(0.65 0.20 290)`) - AI features and projections
- **Foreground/Background Pairings**:
  - Background (Deep Space `oklch(0.15 0.02 250)`): Light text (`oklch(0.95 0 0)`) - Ratio 13.5:1 ✓
  - Card (Slate `oklch(0.30 0.08 250)`): Light text (`oklch(0.95 0 0)`) - Ratio 8.2:1 ✓
  - Primary (Deep Blue `oklch(0.20 0.08 250)`): White text (`oklch(1 0 0)`) - Ratio 11.8:1 ✓
  - Long (Green `oklch(0.75 0.22 150)`): Dark text (`oklch(0.15 0.02 250)`) - Ratio 10.2:1 ✓
  - Short (Red `oklch(0.70 0.25 10)`): Dark text (`oklch(0.15 0.02 250)`) - Ratio 9.5:1 ✓
  - Amber (Gold `oklch(0.75 0.18 70)`): Dark text (`oklch(0.15 0.02 250)`) - Ratio 10.8:1 ✓

## Font Selection
Inter for all UI elements with IBM Plex Mono for financial data, prices, tickers, and gaming results to ensure numerical clarity and professional data display.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/36px/tight tracking (-0.02em)
  - H2 (Section Headers): Inter SemiBold/28px/normal tracking
  - H3 (Card Titles): Inter SemiBold/20px/normal tracking
  - Body (Descriptions): Inter Regular/15px/relaxed line-height (1.6)
  - Data Labels: Inter Medium/13px/normal tracking
  - Prices/Tickers: IBM Plex Mono Bold/18px/tabular-nums
  - P&L Values: IBM Plex Mono SemiBold/varies/tabular-nums with color
  - Gaming Stats: IBM Plex Mono Medium/16px for wagers and results
  - Timestamps: Inter Regular/12px/60% opacity

## Animations
Animations communicate state changes, guide attention to important updates, and add delight without sacrificing performance or clarity. Cursor particles follow movement, gradients shift with market trends, and gaming experiences are visually engaging.

- **Purposeful Meaning**: 
  - Cursor particles trail mouse movement creating interactivity
  - Background gradients shift colors based on dominant market sentiment (green for bullish, red for bearish)
  - Reality projections fade in sequentially to tell story
  - Sentiment scores pulse on updates with color transition
  - Alerts slide down with urgency-based timing
  - Gaming animations (dice roll, coin flip) are satisfying and quick (2-3s max)
  - Position P&L numbers animate color on profit/loss changes
  - Chart lines draw in smoothly on load
  
- **Hierarchy of Movement**: 
  - **Critical**: Downtrend alerts (bold slide with bounce, 400ms)
  - **High**: Game results, trade confirmations (scale + fade, 300ms)
  - **Medium**: Sentiment updates, price changes (pulse, 200ms)
  - **Low**: Hover states, tab switches (smooth transition, 150ms)
  - **Ambient**: Cursor particles, gradient shifts (continuous, subtle)

## Component Selection
- **Components**: 
  - **Trading**: Card for positions, Input for size/leverage, Slider for leverage selection, Button for long/short/close
  - **Sentiment**: Card for reality projections, Badge for sentiment labels, Progress for probabilities, Chart (recharts) for price paths
  - **Gaming**: Card for game lobbies, Tabs for game types, ScrollArea for lobby list, Badge for game status
  - **Affiliate**: Card for stats, Input for referral code, Button for copy/share, Table for leaderboard
  - **General**: Alert for notifications, Toast for confirmations, Dialog for modals, Tooltip for explanations
  
- **Customizations**: 
  - Glassmorphic cards with `backdrop-blur-xl` and semi-transparent backgrounds
  - Glowing tooltips that appear on hover with live data updates
  - Custom gradient backgrounds that transition based on market sentiment
  - Animated particle system following cursor
  - Gaming dice/coin with 3D rotation effects
  - Multi-line chart showing parallel realities with diverging paths
  - Position card with real-time P&L color transitions
  
- **States**: 
  - **Cards**: Glass effect with `backdrop-blur`, hover elevation, active glow for selected
  - **Buttons**: Long (green gradient), Short (red gradient), hover lift, active press, loading spinner
  - **Gaming Elements**: Idle animation, rolling/flipping animation, result celebration
  - **Alerts**: Severity-based colors, slide-in animation, dismiss swipe
  - **Positions**: Positive P&L (green text/border), Negative (red), Near liquidation (pulsing red)
  
- **Icon Selection**: 
  - TrendUp/TrendDown for positions and sentiment
  - ChartLine for realities and markets
  - Lightning for leverage and gaming
  - Trophy for winners and leaderboard
  - Coins/Money for balance and wagers
  - Users/UserPlus for affiliate and referrals
  - Hash for hashtag trends
  - Bell for alerts
  - Sparkle for AI features
  - DiceThree/CoinVertical for games
  - Fire for hot/trending
  
- **Spacing**: Base 4px system - tight gaps (8px) for related data, comfortable (16px) for sections, generous (24-32px) for major divisions, cards with 20-24px padding
- **Mobile**: 
  - Stack trading panel above chart
  - Single column for positions and games
  - Bottom sheet for trade entry
  - Swipeable tabs for main navigation
  - Collapsed sidebar with hamburger menu
  - Touch-optimized buttons (min 44px height)
  - Sticky headers for context
  - Reduced chart heights for space efficiency
