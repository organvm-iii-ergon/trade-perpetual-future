import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { DriftClient, User } from '@drift-labs/sdk-browser'
import { Toaster } from 'sonner'

// Production trading components
import TradePanel from '@/components/trading/TradePanel'
import RiskWarning from '@/components/common/RiskWarning'
import PositionPanel from '@/components/trading/PositionPanel'
import DashboardPanel from '@/components/analytics/DashboardPanel'
import PnLAnalytics from '@/components/analytics/PnLAnalytics'
import Soothsayer from '@/components/common/Soothsayer'
import OrderHistory from '@/components/trading/OrderHistory'

// Archive-ported components
import { MarketCard } from '@/components/markets/MarketCard'
import { SymbolCard } from '@/components/markets/SymbolCard'
import { PriceChart } from '@/components/markets/PriceChart'
import { RealityCard } from '@/components/markets/RealityCard'
import { AddSymbolDialog } from '@/components/markets/AddSymbolDialog'
import { PositionCard } from '@/components/markets/PositionCard'
import { GamesTab } from '@/components/gaming/GamesTab'
import { AchievementsTab } from '@/components/gaming/AchievementsTab'
import { AchievementUnlockNotification } from '@/components/gaming/AchievementUnlockNotification'
import { LeaderboardTab } from '@/components/gaming/LeaderboardTab'
import { AffiliateTab } from '@/components/social/AffiliateTab'
import { HashtagPanel } from '@/components/social/HashtagPanel'
import { AlertBanner } from '@/components/common/AlertBanner'
import { PersonalizationPanel } from '@/components/personalization/PersonalizationPanel'
import { CursorParticles } from '@/components/personalization/CursorParticles'
import { DynamicBackground } from '@/components/personalization/DynamicBackground'

// Hooks & libs
import { usePersistence } from '@/hooks/use-persistence'
import { useLivePrices } from '@/hooks/use-live-prices'
import { useThemePreferences } from '@/hooks/use-theme-preferences'
import { analyzeSentiment, generateRealities, analyzeHashtags, checkForAlerts } from '@/lib/sentiment'
import { initializeAchievements } from '@/lib/achievements'
import { generateReferralCode } from '@/lib/affiliate'

import type {
  Symbol, SentimentData, Reality, HashtagTrend, Alert, SimMarket,
  Position, Game, Achievement, AffiliateStats, LeaderboardEntry, UserProfile
} from '@/types'

type TabId = 'dashboard' | 'markets' | 'trading' | 'games' | 'social' | 'settings'

const DEFAULT_SIM_MARKETS: SimMarket[] = [
  { symbol: 'SOL-PERP', name: 'Solana Perp', currentPrice: 125, change24h: 2.5, volume24h: 45_000_000, openInterest: 12_000_000, fundingRate: 0.01, high24h: 128, low24h: 120, basePrice: 122, priceHistory: [] },
  { symbol: 'BTC-PERP', name: 'Bitcoin Perp', currentPrice: 67_500, change24h: 1.2, volume24h: 890_000_000, openInterest: 350_000_000, fundingRate: 0.008, high24h: 68_200, low24h: 66_800, basePrice: 66_700, priceHistory: [] },
  { symbol: 'ETH-PERP', name: 'Ethereum Perp', currentPrice: 3_450, change24h: -0.8, volume24h: 320_000_000, openInterest: 95_000_000, fundingRate: 0.005, high24h: 3_520, low24h: 3_400, basePrice: 3_478, priceHistory: [] },
]

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'markets', label: 'Markets' },
  { id: 'trading', label: 'Trading' },
  { id: 'games', label: 'Games' },
  { id: 'social', label: 'Social' },
  { id: 'settings', label: 'Settings' },
]

function App() {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState('')
  const [driftMarkets, setDriftMarkets] = useState<any[]>([])
  const [activeTab, setActiveTab] = usePersistence<TabId>('active-tab', 'dashboard')

  // Simulated market state (from archive)
  const simMarkets = useLivePrices(DEFAULT_SIM_MARKETS)
  const [symbols, setSymbols] = usePersistence<Symbol[]>('watchlist', [])
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [realities, setRealities] = useState<Reality[]>([])
  const [hashtags, setHashtags] = useState<HashtagTrend[]>([])
  const [alerts, setAlerts] = usePersistence<Alert[]>('alerts', [])
  const [previousSentiments] = useState<Map<string, SentimentData>>(new Map())

  // Gaming state
  const [balance, setBalance] = usePersistence<number>('balance', 10000)
  const [games, setGames] = usePersistence<Game[]>('games', [])
  const [achievements, setAchievements] = usePersistence<Achievement[]>('achievements', initializeAchievements())
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null)

  // Social state
  const [affiliateStats] = usePersistence<AffiliateStats>('affiliate-stats', {
    referralCode: generateReferralCode('anon'),
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    totalCommissions: 0,
    earningsThisMonth: 0,
    lifetimeVolume: 0,
    conversionRate: 0,
  })

  // Simulated positions (from archive market simulation)
  const [simPositions, setSimPositions] = usePersistence<Position[]>('sim-positions', [])

  // Leaderboard (simulated)
  const [leaderboard] = useState<LeaderboardEntry[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      userId: `user_${i}`,
      username: `trader_${i + 1}`,
      totalVolume: Math.round(Math.random() * 100000),
      totalPnl: Math.round((Math.random() - 0.3) * 50000),
      winRate: Math.round(40 + Math.random() * 40),
      value: Math.round((Math.random() - 0.3) * 50000),
      tier: (['bronze', 'silver', 'gold', 'platinum'] as const)[Math.floor(Math.random() * 4)],
    }))
  )

  // Theme preferences
  useThemePreferences()
  const [particlesEnabled] = usePersistence<boolean>('particles-enabled', true)

  // Initialize Drift
  useEffect(() => {
    if (publicKey && connection && signTransaction && signAllTransactions && !driftClient) {
      initializeDrift()
    }
  }, [publicKey, connection, signTransaction, signAllTransactions])

  const initializeDrift = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) return
    setIsInitializing(true)
    setStatus('Initializing Drift Protocol...')

    try {
      const driftEnv = import.meta.env.VITE_DRIFT_ENV || 'devnet'
      const client = new DriftClient({
        connection,
        wallet: { publicKey, signTransaction, signAllTransactions },
        env: driftEnv as 'devnet' | 'mainnet-beta',
      })

      await client.subscribe()
      setDriftClient(client)

      const perpMarkets = client.getPerpMarketAccounts()
      const spotMarkets = client.getSpotMarketAccounts()
      setDriftMarkets([...perpMarkets, ...spotMarkets])

      const userAccountPublicKey = await client.getUserAccountPublicKey()
      const userAccountExists = await connection.getAccountInfo(userAccountPublicKey)

      if (!userAccountExists) {
        setStatus('Drift user account not found. Please create one at drift.trade first.')
        setIsInitializing(false)
        return
      }

      const driftUser = new User({ driftClient: client, userAccountPublicKey })
      await driftUser.subscribe()
      setUser(driftUser)
      setStatus('Connected to Drift Protocol!')
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      console.error('Error initializing Drift:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to initialize'}`)
    } finally {
      setIsInitializing(false)
    }
  }

  // Load sentiment for selected symbol
  useEffect(() => {
    if (!selectedSymbol) return
    const sym = symbols.find(s => s.ticker === selectedSymbol)
    if (!sym) return

    const load = async () => {
      const sentiment = await analyzeSentiment(selectedSymbol)
      const newRealities = await generateRealities(selectedSymbol, sym.currentPrice, sentiment)
      const newHashtags = await analyzeHashtags(selectedSymbol)
      setRealities(newRealities)
      setHashtags(newHashtags)

      const alert = checkForAlerts(selectedSymbol, sentiment, previousSentiments.get(selectedSymbol))
      if (alert) setAlerts(prev => [alert, ...prev.slice(0, 9)])
    }
    load()
  }, [selectedSymbol])

  // Symbol add
  const handleAddSymbol = async (ticker: string) => {
    if (symbols.find(s => s.ticker === ticker)) return
    const sentiment = await analyzeSentiment(ticker)
    const newSymbol: Symbol = {
      ticker,
      name: ticker,
      currentPrice: 100 + Math.random() * 900,
      sentiment,
    }
    setSymbols(prev => [...prev, newSymbol])
    if (!selectedSymbol) setSelectedSymbol(ticker)
  }

  // Game handlers
  const handleCreateGame = (type: Game['type'], wager: number) => {
    if (wager > balance) return
    setBalance(prev => prev - wager)
    const game: Game = {
      id: `game-${Date.now()}`,
      type,
      wager,
      creatorId: publicKey?.toBase58().slice(0, 8) ?? 'you',
      status: 'waiting',
      createdAt: Date.now(),
    }
    setGames(prev => [game, ...prev])
  }

  const handleJoinGame = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id !== gameId) return g
      if (g.wager > balance) return g
      setBalance(b => b - g.wager)
      const winnerId = Math.random() > 0.5 ? (publicKey?.toBase58().slice(0, 8) ?? 'you') : g.creatorId
      if (winnerId === (publicKey?.toBase58().slice(0, 8) ?? 'you')) {
        setBalance(b => b + g.wager * 2 * 0.95)
      }
      return { ...g, status: 'completed' as const, opponentId: publicKey?.toBase58().slice(0, 8) ?? 'you', result: { winnerId, outcome: {}, timestamp: Date.now() } }
    }))
  }

  // Close simulated position
  const handleCloseSimPosition = (id: string) => {
    setSimPositions(prev => prev.filter(p => p.id !== id))
  }

  // Dismiss alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a))
  }

  const userId = publicKey?.toBase58().slice(0, 8) ?? 'anon'
  const activeAlerts = alerts.filter(a => !a.dismissed)

  return (
    <div className="min-h-screen bg-base-200 relative">
      <DynamicBackground />
      {particlesEnabled && <CursorParticles />}
      <Toaster position="top-right" richColors />

      {/* Achievement notification */}
      {lastUnlocked && (
        <AchievementUnlockNotification
          achievement={lastUnlocked}
          onDismiss={() => setLastUnlocked(null)}
        />
      )}

      {/* Header */}
      <div className="navbar bg-base-100/80 backdrop-blur-xl shadow-lg sticky top-0 z-40">
        <div className="flex-1">
          <span className="btn btn-ghost text-2xl font-bold text-gradient-animated">
            Bang Perp Exchange
          </span>
        </div>
        <div className="flex-none gap-2">
          {status && (
            <span className="text-sm text-base-content/70 hidden md:inline">{status}</span>
          )}
          <WalletMultiButton />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-base-100/60 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4">
          <div role="tablist" className="tabs tabs-boxed bg-transparent gap-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                className={`tab ${activeTab === tab.id ? 'tab-active glass-strong' : 'hover:bg-base-300/30'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">

        {/* Active alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-4">
            <AlertBanner
              alerts={activeAlerts.slice(0, 5)}
              onDismiss={handleDismissAlert}
              onDismissAll={() => setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })))}
            />
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <RiskWarning />
            <DashboardPanel user={user} />
            <div className="grid lg:grid-cols-2 gap-6">
              <PnLAnalytics user={user} />
              <Soothsayer />
            </div>
          </div>
        )}

        {/* Markets Tab */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Markets</h2>
              <AddSymbolDialog onAdd={handleAddSymbol} />
            </div>

            {/* Simulated markets grid */}
            {simMarkets.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simMarkets.map((m) => (
                  <PriceChart key={m.symbol} market={m} />
                ))}
              </div>
            )}

            {/* Symbol watchlist */}
            {symbols.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-8">Watchlist</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {symbols.map((sym) => (
                    <SymbolCard
                      key={sym.ticker}
                      symbol={sym}
                      onClick={() => setSelectedSymbol(sym.ticker)}
                      isSelected={selectedSymbol === sym.ticker}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Reality projections */}
            {realities.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-8">Reality Projections — {selectedSymbol}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {realities.map((r, i) => (
                    <RealityCard key={r.id} reality={r} index={i} />
                  ))}
                </div>
              </>
            )}

            {/* Sim positions */}
            {simPositions.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-8">Sim Positions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {simPositions.map(p => (
                    <PositionCard key={p.id} position={p} onClose={handleCloseSimPosition} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Trading Tab */}
        {activeTab === 'trading' && (
          <div className="space-y-6">
            <TradePanel
              driftClient={driftClient}
              user={user}
              isInitializing={isInitializing}
              status={status}
              markets={driftMarkets}
            />
            <PositionPanel user={user} driftClient={driftClient} />
            <OrderHistory user={user} />
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div role="tablist" className="tabs tabs-boxed mb-4">
              <button className="tab tab-active">Arena</button>
            </div>
            <GamesTab
              games={games}
              balance={balance}
              currentUserId={userId}
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
              totalGamesPlayed={games.filter(g => g.status === 'completed').length}
              totalWinnings={0}
              winRate={50}
              currentStreak={0}
            />
            <div className="grid lg:grid-cols-2 gap-6">
              <AchievementsTab
                achievements={achievements}
                totalUnlocked={achievements.filter(a => a.unlocked).length}
              />
              <LeaderboardTab
                entries={leaderboard}
                currentUserId={userId}
              />
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <AffiliateTab
              profile={{
                userId,
                balance,
                totalVolume: 0,
                totalPnl: 0,
                winRate: 50,
                affiliateEarnings: affiliateStats.totalEarnings,
                referralCode: affiliateStats.referralCode,
              }}
              stats={affiliateStats}
            />
            {hashtags.length > 0 && <HashtagPanel hashtags={hashtags} />}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <PersonalizationPanel />
        )}
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 text-base-content mt-16 relative z-10">
        <div>
          <p className="font-bold text-gradient">Bang Perp Exchange</p>
          <p>Non-custodial perpetual futures trading on Solana</p>
          <p className="text-xs opacity-60">
            Powered by <a href="https://drift.trade" target="_blank" rel="noopener noreferrer" className="link">Drift Protocol</a>
          </p>
          <p className="text-xs opacity-60 mt-2">
            Trading involves risk. Only trade what you can afford to lose.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
