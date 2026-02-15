import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect, lazy, Suspense } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { DriftClient, User } from '@drift-labs/sdk-browser'
import { Toaster } from 'sonner'

// Eagerly loaded (lightweight, always visible)
import { AchievementUnlockNotification } from '@/components/gaming/AchievementUnlockNotification'
import { AlertBanner } from '@/components/common/AlertBanner'
import { CursorParticles } from '@/components/personalization/CursorParticles'
import { DynamicBackground } from '@/components/personalization/DynamicBackground'
import { TabSkeleton } from '@/components/common/TabSkeleton'
import { MobileNav } from '@/components/common/MobileNav'
import { useIsMobile } from '@/hooks/use-mobile'

// Lazy-loaded tab wrappers
const DashboardTab = lazy(() => import('@/components/tabs/DashboardTab'))
const MarketsTab = lazy(() => import('@/components/tabs/MarketsTab'))
const TradingTab = lazy(() => import('@/components/tabs/TradingTab'))
const GamesTabWrapper = lazy(() => import('@/components/tabs/GamesTabWrapper'))
const SocialTab = lazy(() => import('@/components/tabs/SocialTab'))
const SettingsTab = lazy(() => import('@/components/tabs/SettingsTab'))

// Hooks & libs
import { usePersistence } from '@/hooks/use-persistence'
import { useLivePrices } from '@/hooks/use-live-prices'
import { useThemePreferences } from '@/hooks/use-theme-preferences'
import { analyzeSentiment, generateRealities, analyzeHashtags, checkForAlerts } from '@/lib/sentiment'
import { initializeAchievements } from '@/lib/achievements'
import { generateReferralCode } from '@/lib/affiliate'
import { useGameProgram } from '@/hooks/use-game-program'

import type {
  Symbol, SentimentData, Reality, HashtagTrend, Alert, SimMarket,
  Position, Game, Achievement, AffiliateStats, LeaderboardEntry,
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

  // Simulated market state
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

  // Game adapter
  const { adapter: gameAdapter, mode: gameMode, setMode: setGameMode } = useGameProgram({
    getGames: () => games,
    setGames,
    getBalance: () => balance,
    setBalance,
  })

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

  // Simulated positions
  const [simPositions, setSimPositions] = usePersistence<Position[]>('sim-positions', [])

  // Leaderboard
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

  // Responsive
  const isMobile = useIsMobile()

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

  // Game handlers (adapter-backed)
  const handleCreateGame = async (type: Game['type'], wager: number) => {
    try {
      await gameAdapter.createGame(type, wager, publicKey?.toBase58().slice(0, 8) ?? 'you')
    } catch (err) {
      console.error('Create game failed:', err)
    }
  }

  const handleJoinGame = async (gameId: string) => {
    try {
      await gameAdapter.joinGame(gameId, publicKey?.toBase58().slice(0, 8) ?? 'you', games)
    } catch (err) {
      console.error('Join game failed:', err)
    }
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

      {/* Tab Navigation (desktop only) */}
      {!isMobile && (
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
      )}

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-6 relative z-10 ${isMobile ? 'pb-20' : ''}`}>
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

        {activeTab === 'dashboard' && (
          <Suspense fallback={<TabSkeleton type="dashboard" />}>
            <DashboardTab user={user} />
          </Suspense>
        )}

        {activeTab === 'markets' && (
          <Suspense fallback={<TabSkeleton type="markets" />}>
            <MarketsTab
              simMarkets={simMarkets}
              symbols={symbols}
              selectedSymbol={selectedSymbol}
              realities={realities}
              simPositions={simPositions}
              onSelectSymbol={setSelectedSymbol}
              onAddSymbol={handleAddSymbol}
              onCloseSimPosition={handleCloseSimPosition}
            />
          </Suspense>
        )}

        {activeTab === 'trading' && (
          <Suspense fallback={<TabSkeleton type="trading" />}>
            <TradingTab
              driftClient={driftClient}
              user={user}
              isInitializing={isInitializing}
              status={status}
              markets={driftMarkets}
            />
          </Suspense>
        )}

        {activeTab === 'games' && (
          <Suspense fallback={<TabSkeleton type="games" />}>
            <GamesTabWrapper
              games={games}
              balance={balance}
              currentUserId={userId}
              achievements={achievements}
              leaderboard={leaderboard}
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
              gameMode={gameMode}
              onModeChange={setGameMode}
            />
          </Suspense>
        )}

        {activeTab === 'social' && (
          <Suspense fallback={<TabSkeleton type="social" />}>
            <SocialTab
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
              hashtags={hashtags}
            />
          </Suspense>
        )}

        {activeTab === 'settings' && (
          <Suspense fallback={<TabSkeleton type="settings" />}>
            <SettingsTab />
          </Suspense>
        )}
      </div>

      {/* Footer */}
      {!isMobile && (
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
      )}

      {/* Mobile bottom nav */}
      {isMobile && <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  )
}

export default App
