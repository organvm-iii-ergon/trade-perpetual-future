import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInPage } from '@/components/SignInPage'
import { CursorParticles } from '@/components/CursorParticles'
import { useMarketBackground } from '@/hooks/use-market-background'
import { useLivePrices } from '@/hooks/use-live-prices'
import { ChartLine, Hash, Bell, Eye, TrendUp, DiceThree, ShareNetwork, Sparkle } from '@phosphor-icons/react'
import type { Symbol, Reality, HashtagTrend, Alert, Market, Position, Game, UserProfile } from '@/lib/types'
import { analyzeSentiment, generateRealities, analyzeHashtags, checkForAlerts } from '@/lib/sentiment'
import { generateSeed, rollDice, flipCoin, predictPrice, calculateGamePayout } from '@/lib/game-logic'
import { generateReferralCode, calculateCommission } from '@/lib/affiliate'

import { SymbolCard } from '@/components/SymbolCard'
import { RealityCard } from '@/components/RealityCard'
import { AlertBanner } from '@/components/AlertBanner'
import { HashtagPanel } from '@/components/HashtagPanel'
import { AddSymbolDialog } from '@/components/AddSymbolDialog'
import { MarketCard } from '@/components/MarketCard'
import { TradingPanel } from '@/components/TradingPanel'
import { PositionCard } from '@/components/PositionCard'
import { PriceChart } from '@/components/PriceChart'
import { GamesTab } from '@/components/GamesTab'
import { AffiliateTab } from '@/components/AffiliateTab'
import { LeaderboardTab } from '@/components/LeaderboardTab'

const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'SOL']

const INITIAL_MARKETS: Market[] = [
  {
    symbol: 'BTC-PERP',
    name: 'Bitcoin',
    currentPrice: 67500,
    change24h: 2.5,
    volume24h: 45000000,
    openInterest: 2500000,
    fundingRate: 0.0001,
    high24h: 68200,
    low24h: 66800,
    basePrice: 67500,
    priceHistory: Array.from({ length: 50 }, (_, i) => ({
      time: Date.now() - (50 - i) * 60000,
      price: 67500 + (Math.random() - 0.5) * 2000,
    })),
  },
  {
    symbol: 'ETH-PERP',
    name: 'Ethereum',
    currentPrice: 3200,
    change24h: -1.2,
    volume24h: 28000000,
    openInterest: 1800000,
    fundingRate: -0.0001,
    high24h: 3250,
    low24h: 3180,
    basePrice: 3200,
    priceHistory: Array.from({ length: 50 }, (_, i) => ({
      time: Date.now() - (50 - i) * 60000,
      price: 3200 + (Math.random() - 0.5) * 100,
    })),
  },
  {
    symbol: 'SOL-PERP',
    name: 'Solana',
    currentPrice: 145,
    change24h: 5.8,
    volume24h: 12000000,
    openInterest: 950000,
    fundingRate: 0.0002,
    high24h: 148,
    low24h: 142,
    basePrice: 145,
    priceHistory: Array.from({ length: 50 }, (_, i) => ({
      time: Date.now() - (50 - i) * 60000,
      price: 145 + (Math.random() - 0.5) * 10,
    })),
  },
]

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [username, setUsername] = useState('demo_user')
  
  const [watchlist, setWatchlist] = useKV<string[]>('watchlist', DEFAULT_SYMBOLS)
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null)
  const [realities, setRealities] = useState<Reality[]>([])
  const [hashtags, setHashtags] = useState<HashtagTrend[]>([])
  const [alerts, setAlerts] = useKV<Alert[]>('alerts', [])
  
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS)
  const liveMarkets = useLivePrices(markets)
  const [selectedMarket, setSelectedMarket] = useState<Market>(liveMarkets[0])
  const [positions, setPositions] = useKV<Position[]>('positions', [])
  
  const [games, setGames] = useKV<Game[]>('games', [])
  const [profile, setProfile] = useKV<UserProfile>('profile', {
    userId: 'demo_user',
    balance: 10000,
    totalVolume: 0,
    totalPnl: 0,
    winRate: 0,
    affiliateEarnings: 0,
    referralCode: generateReferralCode('demo_user'),
    referredBy: undefined,
  })
  
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const currentWatchlist = watchlist ?? DEFAULT_SYMBOLS
  const currentAlerts = (alerts ?? []).filter(a => !a.dismissed)
  const currentPositions = positions ?? []
  const currentGames = games ?? []
  const currentProfile = profile ?? {
    userId: 'demo_user',
    balance: 10000,
    totalVolume: 0,
    totalPnl: 0,
    winRate: 0,
    affiliateEarnings: 0,
    referralCode: generateReferralCode('demo_user'),
  }

  useEffect(() => {
    if (isSignedIn) {
      loadSymbols()
    }
  }, [isSignedIn, currentWatchlist])

  useEffect(() => {
    const selected = liveMarkets.find(m => m.symbol === selectedMarket?.symbol)
    if (selected) {
      setSelectedMarket(selected)
    }
  }, [liveMarkets, selectedMarket?.symbol])

  useEffect(() => {
    if (currentPositions.length > 0 && liveMarkets.length > 0) {
      const updatedPositions = currentPositions.map(position => {
        const market = liveMarkets.find(m => m.symbol === position.marketSymbol)
        if (!market) return position

        const priceDiff = market.currentPrice - position.entryPrice
        const pnlMultiplier = position.side === 'long' ? 1 : -1
        const unrealizedPnl = (priceDiff / position.entryPrice) * position.size * position.leverage * pnlMultiplier
        const unrealizedPnlPercent = (unrealizedPnl / position.size) * 100

        return {
          ...position,
          currentPrice: market.currentPrice,
          pnl: unrealizedPnl,
          pnlPercent: unrealizedPnlPercent,
          unrealizedPnl,
          unrealizedPnlPercent,
        }
      })
      setPositions(updatedPositions)
    }
  }, [liveMarkets])

  useMarketBackground(liveMarkets)

  const loadSymbols = async () => {
    setIsLoadingSentiment(true)
    try {
      const symbolsData: Symbol[] = []
      
      for (const ticker of currentWatchlist) {
        const sentiment = await analyzeSentiment(ticker)
        const alert = checkForAlerts(ticker, sentiment)
        
        if (alert) {
          setAlerts(current => [alert, ...(current ?? [])])
          toast.error(alert.message)
        }

        const market = liveMarkets.find(m => m.symbol.startsWith(ticker))
        const price = market?.currentPrice || getSymbolPrice(ticker)

        symbolsData.push({
          ticker,
          name: getSymbolName(ticker),
          currentPrice: price,
          sentiment
        })
      }

      setSymbols(symbolsData)
      if (symbolsData.length > 0 && !selectedSymbol) {
        setSelectedSymbol(symbolsData[0])
      }
    } catch (error) {
      toast.error('Failed to load sentiment data')
    } finally {
      setIsLoadingSentiment(false)
    }
  }

  const analyzeSymbol = async (symbol: Symbol) => {
    setIsAnalyzing(true)
    try {
      const [realitiesData, hashtagsData] = await Promise.all([
        generateRealities(symbol.ticker, symbol.currentPrice, symbol.sentiment),
        analyzeHashtags(symbol.ticker)
      ])

      setRealities(realitiesData)
      setHashtags(hashtagsData)
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (selectedSymbol && isSignedIn) {
      analyzeSymbol(selectedSymbol)
    }
  }, [selectedSymbol])

  const handleSignIn = async () => {
    try {
      const user = await window.spark.user()
      if (user) {
        setUsername(user.login)
        setIsSignedIn(true)
        toast.success(`Welcome back, ${user.login}!`)
      } else {
        setUsername('demo_user')
        setIsSignedIn(true)
        toast.success('Signed in as demo user')
      }
    } catch {
      setUsername('demo_user')
      setIsSignedIn(true)
      toast.success('Signed in as demo user')
    }
  }

  const handleAddSymbol = async (ticker: string) => {
    if (currentWatchlist.includes(ticker)) {
      toast.error(`${ticker} is already in your watchlist`)
      return
    }
    setWatchlist(current => [...(current ?? []), ticker])
    toast.success(`Added ${ticker} to watchlist`)
  }

  const handleRemoveSymbol = (ticker: string) => {
    setWatchlist(current => (current ?? []).filter(t => t !== ticker))
    if (selectedSymbol?.ticker === ticker) {
      const remaining = symbols.filter(s => s.ticker !== ticker)
      setSelectedSymbol(remaining[0] || null)
    }
    toast.success(`Removed ${ticker} from watchlist`)
  }

  const handleDismissAlert = (id: string) => {
    setAlerts(current => 
      (current ?? []).map(a => a.id === id ? { ...a, dismissed: true } : a)
    )
  }

  const handleTrade = (side: 'long' | 'short', size: number, leverage: number) => {
    if (size > currentProfile.balance) {
      toast.error('Insufficient balance')
      return
    }

    const liquidationPrice = side === 'long'
      ? selectedMarket.currentPrice * (1 - 1 / leverage + 0.05)
      : selectedMarket.currentPrice * (1 + 1 / leverage - 0.05)

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: selectedMarket.symbol,
      marketSymbol: selectedMarket.symbol,
      side,
      size,
      leverage,
      entryPrice: selectedMarket.currentPrice,
      currentPrice: selectedMarket.currentPrice,
      liquidationPrice,
      pnl: 0,
      pnlPercent: 0,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      timestamp: Date.now(),
    }

    setPositions(current => [...(current ?? []), newPosition])
    setProfile(current => ({
      ...(current ?? currentProfile),
      balance: (current?.balance ?? currentProfile.balance) - size,
      totalVolume: (current?.totalVolume ?? 0) + size * leverage,
    }))

    toast.success(`Opened ${side.toUpperCase()} position on ${selectedMarket.symbol}`)
  }

  const handleClosePosition = (positionId: string) => {
    const position = currentPositions.find(p => p.id === positionId)
    if (!position) return

    setPositions(current => (current ?? []).filter(p => p.id !== positionId))
    setProfile(current => ({
      ...(current ?? currentProfile),
      balance: (current?.balance ?? currentProfile.balance) + position.size + position.pnl,
      totalPnl: (current?.totalPnl ?? 0) + position.pnl,
    }))

    toast.success(`Closed position: ${position.pnl >= 0 ? '+' : ''}$${position.pnl.toFixed(2)}`)
  }

  const handleCreateGame = (type: Game['type'], wager: number) => {
    if (wager > currentProfile.balance) {
      toast.error('Insufficient balance')
      return
    }

    const newGame: Game = {
      id: `game-${Date.now()}`,
      type,
      wager,
      creatorId: username,
      status: 'waiting',
      createdAt: Date.now(),
    }

    setGames(current => [...(current ?? []), newGame])
    setProfile(current => ({
      ...(current ?? currentProfile),
      balance: (current?.balance ?? currentProfile.balance) - wager,
    }))
  }

  const handleJoinGame = (gameId: string) => {
    const game = currentGames.find(g => g.id === gameId)
    if (!game || game.status !== 'waiting') return

    if (game.wager > currentProfile.balance) {
      toast.error('Insufficient balance')
      return
    }

    const seed1 = generateSeed()
    const seed2 = generateSeed()
    
    let winnerId: string
    let outcome: any

    if (game.type === 'dice') {
      const roll1 = rollDice(seed1)
      const roll2 = rollDice(seed2)
      outcome = { creator: roll1, opponent: roll2 }
      winnerId = roll1 > roll2 ? game.creatorId : roll1 < roll2 ? username : 'tie'
    } else if (game.type === 'coinflip') {
      const flip = flipCoin(seed1)
      outcome = { result: flip }
      winnerId = Math.random() > 0.5 ? game.creatorId : username
    } else {
      const prediction = predictPrice(seed1, selectedMarket.currentPrice)
      outcome = prediction
      winnerId = Math.random() > 0.5 ? game.creatorId : username
    }

    const payout = calculateGamePayout(game.wager)

    setGames(current =>
      (current ?? []).map(g =>
        g.id === gameId
          ? {
              ...g,
              opponentId: username,
              status: 'completed' as const,
              result: { winnerId, outcome, timestamp: Date.now() },
            }
          : g
      )
    )

    setProfile(current => {
      const currentBal = current?.balance ?? currentProfile.balance
      if (winnerId === 'tie') {
        return { ...(current ?? currentProfile), balance: currentBal + game.wager }
      } else if (winnerId === username) {
        return { ...(current ?? currentProfile), balance: currentBal + payout }
      } else {
        return { ...(current ?? currentProfile), balance: currentBal - game.wager }
      }
    })

    if (winnerId === 'tie') {
      toast('Game tied! Wagers refunded')
    } else if (winnerId === username) {
      toast.success(`You won $${payout.toFixed(2)}!`)
    } else {
      toast.error('You lost!')
    }
  }

  const getSymbolPrice = (ticker: string): number => {
    const prices: Record<string, number> = {
      BTC: 67500,
      ETH: 3200,
      SOL: 145,
      AAPL: 185,
      TSLA: 245,
      NVDA: 875,
      MSFT: 420,
      GOOGL: 140
    }
    return prices[ticker] || 100 + Math.random() * 400
  }

  const getSymbolName = (ticker: string): string => {
    const names: Record<string, string> = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SOL: 'Solana',
      AAPL: 'Apple Inc.',
      TSLA: 'Tesla Inc.',
      NVDA: 'NVIDIA Corporation',
      MSFT: 'Microsoft Corporation',
      GOOGL: 'Alphabet Inc.'
    }
    return names[ticker] || `${ticker} Asset`
  }

  if (!isSignedIn) {
    return <SignInPage onSignIn={handleSignIn} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CursorParticles />
      <Toaster position="top-right" />

      <header className="border-b border-border/50 glass-strong backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💥</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-cyan bg-clip-text text-transparent">
                  Bang Perp Exchange
                </h1>
                <p className="text-xs text-foreground/60">Social Trading • AI Sentiment • PvP Games</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass rounded-xl px-4 py-2 border border-white/10">
                <div className="text-xs text-foreground/60">Balance</div>
                <div className="font-mono font-bold text-lg">${currentProfile.balance.toFixed(2)}</div>
              </div>
              <div className="glass rounded-xl px-3 py-2 border border-white/10">
                <span className="text-sm font-semibold">{username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {currentAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {currentAlerts.slice(0, 3).map(alert => (
              <AlertBanner
                key={alert.id}
                alert={alert}
                onDismiss={() => handleDismissAlert(alert.id)}
              />
            ))}
          </div>
        )}

        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="glass-strong grid w-full grid-cols-6 h-14 p-1">
            <TabsTrigger value="markets" className="gap-2 data-[state=active]:glass-strong">
              <TrendUp size={18} weight="duotone" />
              Markets
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="gap-2 data-[state=active]:glass-strong">
              <Eye size={18} weight="duotone" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="realities" className="gap-2 data-[state=active]:glass-strong" disabled={!selectedSymbol}>
              <ChartLine size={18} weight="duotone" />
              Realities
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2 data-[state=active]:glass-strong">
              <DiceThree size={18} weight="duotone" />
              Games
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="gap-2 data-[state=active]:glass-strong">
              <ShareNetwork size={18} weight="duotone" />
              Affiliate
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2 data-[state=active]:glass-strong">
              <Bell size={18} weight="duotone" />
              Alerts ({currentAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {liveMarkets.map(market => (
                <MarketCard
                  key={market.symbol}
                  market={market}
                  onClick={() => setSelectedMarket(market)}
                  isSelected={selectedMarket.symbol === market.symbol}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PriceChart market={selectedMarket} />
                
                {currentPositions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Active Positions</h3>
                    <div className="grid gap-4">
                      {currentPositions.map(position => (
                        <PositionCard
                          key={position.id}
                          position={position}
                          onClose={() => handleClosePosition(position.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <TradingPanel
                  market={selectedMarket}
                  balance={currentProfile.balance}
                  onTrade={handleTrade}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Sentiment Watchlist</h2>
              <AddSymbolDialog onAdd={handleAddSymbol} />
            </div>

            {isLoadingSentiment ? (
              <div className="text-center py-12">
                <Sparkle size={48} className="mx-auto mb-4 text-ai-purple animate-spin" />
                <p className="text-foreground/70">Loading sentiment data...</p>
              </div>
            ) : symbols.length === 0 ? (
              <div className="text-center py-12">
                <Eye size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-foreground/70 mb-4">No symbols in watchlist</p>
                <AddSymbolDialog onAdd={handleAddSymbol} />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {symbols.map((symbol) => (
                  <div key={symbol.ticker} className="relative">
                    <SymbolCard
                      symbol={symbol}
                      onClick={() => setSelectedSymbol(symbol)}
                      isSelected={selectedSymbol?.ticker === symbol.ticker}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedSymbol && (
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6">
                  Analysis: {selectedSymbol.ticker}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Current Sentiment</h4>
                    <div className="glass rounded-2xl p-8 border border-white/10">
                      <div className="text-7xl font-mono font-bold text-center mb-4">
                        <span className={
                          selectedSymbol.sentiment.score > 20 
                            ? 'text-long' 
                            : selectedSymbol.sentiment.score < -20 
                            ? 'text-short' 
                            : 'text-foreground/60'
                        }>
                          {selectedSymbol.sentiment.score > 0 ? '+' : ''}{selectedSymbol.sentiment.score}
                        </span>
                      </div>
                      <p className="text-center text-xl font-semibold">
                        {selectedSymbol.sentiment.label}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground/70">Price</span>
                          <span className="font-mono font-bold text-xl">
                            ${selectedSymbol.currentPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground/70">Confidence</span>
                          <span className="font-mono font-bold text-xl">
                            {selectedSymbol.sentiment.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground/70">Volume</span>
                          <span className="font-mono font-bold text-xl">
                            {selectedSymbol.sentiment.volume}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="realities">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <Sparkle size={48} className="mx-auto mb-4 text-ai-purple animate-pulse" />
                <p className="text-lg text-foreground/70">Projecting realities...</p>
              </div>
            ) : realities.length > 0 ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Parallel Realities: {selectedSymbol?.ticker}
                  </h2>
                  <p className="text-foreground/70">
                    AI-generated projections showing possible market outcomes over the next 7 days
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {realities.map((reality, index) => (
                    <RealityCard key={reality.id} reality={reality} index={index} />
                  ))}
                </div>
                
                {hashtags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Trending Hashtags</h3>
                    <HashtagPanel hashtags={hashtags} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChartLine size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground/70">Select a symbol to view reality projections</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="games">
            <GamesTab
              balance={currentProfile.balance}
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
              activeGames={currentGames}
              username={username}
            />
          </TabsContent>

          <TabsContent value="affiliate">
            <div className="space-y-6">
              <AffiliateTab 
                stats={{
                  referralCode: currentProfile.referralCode,
                  totalReferrals: 0,
                  activeReferrals: 0,
                  totalEarnings: currentProfile.affiliateEarnings,
                  totalCommissions: currentProfile.affiliateEarnings,
                  earningsThisMonth: 0,
                  lifetimeVolume: currentProfile.totalVolume,
                  conversionRate: 0,
                }}
                userTier="bronze"
              />
              <LeaderboardTab 
                pnlLeaderboard={[]}
                volumeLeaderboard={[]}
                affiliateLeaderboard={[]}
                currentUserId={username}
              />
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Alert History</h2>
                <p className="text-foreground/70">
                  Track all downtrend alerts and sentiment warnings
                </p>
              </div>
              {(alerts ?? []).length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-foreground/70 mb-2">No alerts yet</p>
                  <p className="text-sm text-foreground/60">
                    You'll be notified when sentiment drops or downtrends are detected
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(alerts ?? []).map(alert => (
                    <AlertBanner
                      key={alert.id}
                      alert={alert}
                      onDismiss={() => handleDismissAlert(alert.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/50 mt-16 py-8 glass">
        <div className="max-w-[1800px] mx-auto px-6 text-center">
          <p className="text-sm text-foreground/60 mb-2">
            ⚠️ Demo Mode: All trades and games use virtual currency for educational purposes
          </p>
          <p className="text-xs text-foreground/50">
            AI-powered sentiment analysis • Real-time market data • Provably fair games • Social trading
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
