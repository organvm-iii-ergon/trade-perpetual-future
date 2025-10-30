import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { SignInPage } from '@/components/SignInPage'
import { MarketCard } from '@/components/MarketCard'
import { TradingPanel } from '@/components/TradingPanel'
import { PositionCard } from '@/components/PositionCard'
import { PriceChart } from '@/components/PriceChart'
import { GamesTab } from '@/components/GamesTab'
import { AffiliateTab } from '@/components/AffiliateTab'
import { LeaderboardTab } from '@/components/LeaderboardTab'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, ChartLine, TrendUp, DiceThree, ShareNetwork, Trophy, SignOut } from '@phosphor-icons/react'
import { useLivePrices } from '@/hooks/use-live-prices'
import { generateReferralCode, getUserTier, calculateCommission } from '@/lib/affiliate'
import { rollDice, flipCoin, generateSeed, calculateGamePayout } from '@/lib/game-logic'
import type { Market, Position, ClosedPosition, User, UserProfile, Game, AffiliateStats, LeaderboardEntry } from '@/lib/types'

const INITIAL_MARKETS: Market[] = [
  {
    id: 'btc',
    symbol: 'BTC-PERP',
    name: 'Bitcoin Perpetual',
    basePrice: 67500,
    currentPrice: 67500,
    change24h: 0,
    volume24h: '$2.4B',
    icon: '₿',
    high24h: 67500,
    low24h: 67500,
    priceHistory: [],
  },
  {
    id: 'eth',
    symbol: 'ETH-PERP',
    name: 'Ethereum Perpetual',
    basePrice: 3200,
    currentPrice: 3200,
    change24h: 0,
    volume24h: '$1.8B',
    icon: 'Ξ',
    high24h: 3200,
    low24h: 3200,
    priceHistory: [],
  },
  {
    id: 'sol',
    symbol: 'SOL-PERP',
    name: 'Solana Perpetual',
    basePrice: 145,
    currentPrice: 145,
    change24h: 0,
    volume24h: '$890M',
    icon: '◎',
    high24h: 145,
    low24h: 145,
    priceHistory: [],
  },
]

const INITIAL_BALANCE = 10000

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [balance, setBalance] = useKV<number>('balance', INITIAL_BALANCE)
  const [positions, setPositions] = useKV<Position[]>('positions', [])
  const [closedPositions, setClosedPositions] = useKV<ClosedPosition[]>('closedPositions', [])
  const [userProfile, setUserProfile] = useKV<UserProfile | null>('userProfile', null)
  const [affiliateStats, setAffiliateStats] = useKV<AffiliateStats | null>('affiliateStats', null)
  const [games, setGames] = useKV<Game[]>('games', [])
  const [selectedMarketId, setSelectedMarketId] = useState('btc')
  const [selectedTab, setSelectedTab] = useState('trade')

  const markets = useLivePrices(INITIAL_MARKETS)
  const selectedMarket = markets.find((m) => m.id === selectedMarketId) || markets[0]

  const currentBalance = balance ?? INITIAL_BALANCE
  const currentPositions = positions ?? []
  const currentClosedPositions = closedPositions ?? []
  const currentGames = games ?? []

  useEffect(() => {
    const initUser = async () => {
      try {
        const sparkUser = await window.spark.user()
        if (!sparkUser) return
        
        const user: User = {
          id: sparkUser.id.toString(),
          login: sparkUser.login,
          avatarUrl: sparkUser.avatarUrl || '',
          email: sparkUser.email,
          isOwner: sparkUser.isOwner,
        }
        setCurrentUser(user)

        if (!userProfile) {
          const newProfile: UserProfile = {
            userId: user.id,
            totalPnl: 0,
            totalTrades: 0,
            winRate: 0,
            totalVolume: 0,
            affiliateEarnings: 0,
            referralCount: 0,
            gameWins: 0,
            gameLosses: 0,
            achievements: [],
            tier: 'bronze',
          }
          setUserProfile(newProfile)
        }

        if (!affiliateStats) {
          const newAffiliateStats: AffiliateStats = {
            userId: user.id,
            referralCode: generateReferralCode(user.id),
            totalReferrals: 0,
            activeReferrals: 0,
            totalCommissions: 0,
            lifetimeVolume: 0,
          }
          setAffiliateStats(newAffiliateStats)
        }
      } catch (error) {
        console.log('User not authenticated')
      }
    }

    initUser()
  }, [])

  useEffect(() => {
    setPositions((currentPositions) => {
      const posList = currentPositions ?? []
      return posList.map((pos) => {
        const market = markets.find((m) => m.id === pos.marketId)
        if (!market) return pos

        const currentPrice = market.currentPrice
        const priceDiff = currentPrice - pos.entryPrice
        const pnlMultiplier = pos.side === 'long' ? 1 : -1
        const unrealizedPnl = (priceDiff / pos.entryPrice) * pos.size * pos.leverage * pnlMultiplier
        const unrealizedPnlPercent = (unrealizedPnl / pos.size) * 100

        return {
          ...pos,
          currentPrice,
          unrealizedPnl,
          unrealizedPnlPercent,
        }
      })
    })
  }, [markets, setPositions])

  const handleSignIn = async () => {
    try {
      const sparkUser = await window.spark.user()
      if (!sparkUser) {
        toast.error('Sign in failed. Please try again.')
        return
      }
      
      const user: User = {
        id: sparkUser.id.toString(),
        login: sparkUser.login,
        avatarUrl: sparkUser.avatarUrl || '',
        email: sparkUser.email,
        isOwner: sparkUser.isOwner,
      }
      setCurrentUser(user)
      toast.success(`Welcome, ${user.login}!`)
    } catch (error) {
      toast.error('Sign in failed. Please try again.')
    }
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    toast.success('Signed out successfully')
  }

  const handleTrade = (side: 'long' | 'short', size: number, leverage: number) => {
    if (!currentUser) {
      toast.error('Please sign in to trade')
      return
    }

    if (size > currentBalance) {
      toast.error('Insufficient balance')
      return
    }

    const maintenanceMargin = 0.05
    const liquidationPrice =
      side === 'long'
        ? selectedMarket.currentPrice * (1 - 1 / leverage + maintenanceMargin)
        : selectedMarket.currentPrice * (1 + 1 / leverage - maintenanceMargin)

    const newPosition: Position = {
      id: Date.now().toString(),
      userId: currentUser.id,
      marketId: selectedMarket.id,
      marketSymbol: selectedMarket.symbol,
      side,
      size,
      leverage,
      entryPrice: selectedMarket.currentPrice,
      currentPrice: selectedMarket.currentPrice,
      liquidationPrice,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      timestamp: Date.now(),
    }

    setPositions((current) => [...(current ?? []), newPosition])
    setBalance((current) => (current ?? INITIAL_BALANCE) - size)

    if (userProfile) {
      setUserProfile({
        ...userProfile,
        totalTrades: userProfile.totalTrades + 1,
        totalVolume: userProfile.totalVolume + size * leverage,
      })
    }

    toast.success(`${side.toUpperCase()} position opened`, {
      description: `${size.toFixed(2)} USD at ${leverage}x leverage`,
    })
  }

  const handleClosePosition = (id: string) => {
    setPositions((currentPositions) => {
      const posList = currentPositions ?? []
      const position = posList.find((p) => p.id === id)
      if (!position) return posList

      const closedPosition: ClosedPosition = {
        ...position,
        exitPrice: position.currentPrice,
        realizedPnl: position.unrealizedPnl,
        realizedPnlPercent: position.unrealizedPnlPercent,
        closedAt: Date.now(),
      }

      setClosedPositions((current) => [closedPosition, ...(current ?? [])])
      setBalance((current) => (current ?? INITIAL_BALANCE) + position.size + position.unrealizedPnl)

      if (userProfile) {
        const isWin = position.unrealizedPnl > 0
        const winCount = isWin ? 1 : 0
        const newTotalWins = userProfile.totalTrades * userProfile.winRate + winCount
        const newWinRate = newTotalWins / (userProfile.totalTrades + 1)

        setUserProfile({
          ...userProfile,
          totalPnl: userProfile.totalPnl + position.unrealizedPnl,
          winRate: newWinRate,
        })
      }

      toast.success('Position closed', {
        description: `P&L: ${position.unrealizedPnl >= 0 ? '+' : ''}$${position.unrealizedPnl.toFixed(2)}`,
      })

      return posList.filter((p) => p.id !== id)
    })
  }

  const handleCreateGame = (type: Game['type'], wager: number) => {
    if (!currentUser) {
      toast.error('Please sign in to play games')
      return
    }

    if (wager > currentBalance) {
      toast.error('Insufficient balance')
      return
    }

    const newGame: Game = {
      id: Date.now().toString(),
      type,
      wager,
      creatorId: currentUser.login,
      status: 'waiting',
      createdAt: Date.now(),
    }

    setGames((current) => [...(current ?? []), newGame])
    setBalance((current) => (current ?? INITIAL_BALANCE) - wager)
  }

  const handleJoinGame = (gameId: string) => {
    if (!currentUser) {
      toast.error('Please sign in to join games')
      return
    }

    setGames((currentGames) => {
      const gamesList = currentGames ?? []
      const game = gamesList.find((g) => g.id === gameId)
      if (!game || game.status !== 'waiting') return gamesList

      if (game.wager > currentBalance) {
        toast.error('Insufficient balance')
        return gamesList
      }

      setBalance((current) => (current ?? INITIAL_BALANCE) - game.wager)

      const seed = generateSeed()
      let winnerId: string
      let outcome: any

      if (game.type === 'dice') {
        const creatorRoll = rollDice(seed + 'creator')
        const opponentRoll = rollDice(seed + 'opponent')
        outcome = { creatorRoll, opponentRoll }
        winnerId = creatorRoll > opponentRoll ? game.creatorId : creatorRoll < opponentRoll ? currentUser.login : 'tie'
      } else if (game.type === 'coinflip') {
        const result = flipCoin(seed)
        outcome = { result }
        winnerId = Math.random() > 0.5 ? game.creatorId : currentUser.login
      } else {
        winnerId = Math.random() > 0.5 ? game.creatorId : currentUser.login
        outcome = { predicted: 'up', actual: 'up' }
      }

      if (winnerId === 'tie') {
        setBalance((current) => (current ?? INITIAL_BALANCE) + game.wager)
        toast.info('Game tied! Wagers refunded.')

        return gamesList.map((g) =>
          g.id === gameId
            ? { ...g, status: 'completed' as const, opponentId: currentUser.login, completedAt: Date.now() }
            : g
        )
      }

      const payout = calculateGamePayout(game.wager)
      const loserId = winnerId === game.creatorId ? currentUser.login : game.creatorId

      if (winnerId === currentUser.login) {
        setBalance((current) => (current ?? INITIAL_BALANCE) + payout)
        toast.success(`You won $${payout.toFixed(2)}!`, {
          description: JSON.stringify(outcome),
        })

        if (userProfile) {
          setUserProfile({
            ...userProfile,
            gameWins: userProfile.gameWins + 1,
          })
        }
      } else {
        toast.error(`You lost. Better luck next time!`, {
          description: JSON.stringify(outcome),
        })

        if (userProfile) {
          setUserProfile({
            ...userProfile,
            gameLosses: userProfile.gameLosses + 1,
          })
        }
      }

      return gamesList.map((g) =>
        g.id === gameId
          ? {
              ...g,
              status: 'completed' as const,
              opponentId: currentUser.login,
              completedAt: Date.now(),
              result: {
                winnerId,
                loserId,
                winnerPayout: payout,
                seed,
                outcome,
              },
            }
          : g
      )
    })
  }

  const totalUnrealizedPnl = currentPositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)
  const totalValue = currentBalance + currentPositions.reduce((sum, pos) => sum + pos.size, 0) + totalUnrealizedPnl

  const mockLeaderboard: LeaderboardEntry[] = [
    { userId: '1', username: 'CryptoKing', avatarUrl: '', value: 15420.50, rank: 1 },
    { userId: '2', username: 'MoonShot', avatarUrl: '', value: 12380.25, rank: 2 },
    { userId: '3', username: 'DiamondHands', avatarUrl: '', value: 9850.00, rank: 3 },
  ]

  if (!currentUser) {
    return <SignInPage onSignIn={handleSignIn} />
  }

  const currentAffiliateStats = affiliateStats || {
    userId: currentUser.id,
    referralCode: generateReferralCode(currentUser.id),
    totalReferrals: 0,
    activeReferrals: 0,
    totalCommissions: 0,
    lifetimeVolume: 0,
  }

  const currentUserProfile = userProfile || {
    userId: currentUser.id,
    totalPnl: 0,
    totalTrades: 0,
    winRate: 0,
    totalVolume: 0,
    affiliateEarnings: 0,
    referralCount: 0,
    gameWins: 0,
    gameLosses: 0,
    achievements: [],
    tier: 'bronze' as const,
  }

  const userTier = getUserTier(currentUserProfile)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💥</div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bang Perp Exchange</h1>
                <p className="text-xs text-muted-foreground">Social Trading Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Card className="p-3 bg-card/80">
                <div className="flex items-center gap-3">
                  <Wallet size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Balance</div>
                    <div className="font-mono font-semibold">${currentBalance.toFixed(2)}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-card/80">
                <div className="flex items-center gap-3">
                  <ChartLine size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Portfolio</div>
                    <div className="font-mono font-semibold">${totalValue.toFixed(2)}</div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center gap-3 border-l border-border pl-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback>{currentUser.login[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{currentUser.login}</div>
                  <Badge variant="secondary" className="text-xs">{userTier}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <SignOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="trade" className="gap-2">
              <ChartLine size={18} />
              Trade
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2">
              <DiceThree size={18} />
              Games
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy size={18} />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="gap-2">
              <ShareNetwork size={18} />
              Affiliate
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <TrendUp size={18} />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trade">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {markets.map((market) => (
                <PriceChart
                  key={market.id}
                  market={market}
                  isSelected={market.id === selectedMarketId}
                  onClick={() => setSelectedMarketId(market.id)}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <TradingPanel market={selectedMarket} balance={currentBalance} onTrade={handleTrade} />

              <Card className="p-6">
                <Tabs defaultValue="open" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="open" className="flex-1">
                      Open Positions ({currentPositions.length})
                    </TabsTrigger>
                    <TabsTrigger value="closed" className="flex-1">
                      History ({currentClosedPositions.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="open">
                    {currentPositions.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-muted-foreground">No open positions</p>
                        <p className="text-sm text-muted-foreground mt-1">Open your first trade to get started</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-3">
                          {currentPositions.map((position) => (
                            <PositionCard key={position.id} position={position} onClose={handleClosePosition} />
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {currentPositions.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Unrealized P&L</span>
                          <span
                            className={`font-mono font-semibold text-lg ${
                              totalUnrealizedPnl >= 0 ? 'text-long' : 'text-short'
                            }`}
                          >
                            {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="closed">
                    {currentClosedPositions.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-3">📜</div>
                        <p className="text-muted-foreground">No trading history</p>
                        <p className="text-sm text-muted-foreground mt-1">Your closed positions will appear here</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-3">
                          {currentClosedPositions.map((position) => (
                            <Card key={position.id} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{position.marketSymbol}</span>
                                  <span className={`text-xs ${position.side === 'long' ? 'text-long' : 'text-short'}`}>
                                    {position.side.toUpperCase()}
                                  </span>
                                </div>
                                <div className={`font-mono ${position.realizedPnl >= 0 ? 'text-long' : 'text-short'}`}>
                                  {position.realizedPnl >= 0 ? '+' : ''}${position.realizedPnl.toFixed(2)}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Entry: </span>
                                  <span className="font-mono">${position.entryPrice.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Exit: </span>
                                  <span className="font-mono">${position.exitPrice.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Size: </span>
                                  <span className="font-mono">${position.size.toFixed(2)}</span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <GamesTab
              balance={currentBalance}
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
              activeGames={currentGames}
              username={currentUser.login}
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab
              pnlLeaderboard={mockLeaderboard}
              volumeLeaderboard={mockLeaderboard}
              affiliateLeaderboard={mockLeaderboard}
              currentUserId={currentUser.id}
            />
          </TabsContent>

          <TabsContent value="affiliate">
            <AffiliateTab stats={currentAffiliateStats} userTier={userTier} />
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
                    <div className={`font-mono text-2xl font-bold ${currentUserProfile.totalPnl >= 0 ? 'text-long' : 'text-short'}`}>
                      {currentUserProfile.totalPnl >= 0 ? '+' : ''}${currentUserProfile.totalPnl.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                    <div className="font-mono text-2xl font-bold">
                      {(currentUserProfile.winRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
                    <div className="font-mono text-2xl font-bold">{currentUserProfile.totalTrades}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Volume</div>
                    <div className="font-mono text-2xl font-bold">
                      ${(currentUserProfile.totalVolume / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Game Stats</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Wins</div>
                    <div className="font-mono text-2xl font-bold text-long">{currentUserProfile.gameWins}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Losses</div>
                    <div className="font-mono text-2xl font-bold text-short">{currentUserProfile.gameLosses}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                    <div className="font-mono text-2xl font-bold">
                      {currentUserProfile.gameWins + currentUserProfile.gameLosses > 0
                        ? ((currentUserProfile.gameWins / (currentUserProfile.gameWins + currentUserProfile.gameLosses)) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            ⚠️ Trading and gaming involve risk. Only invest what you can afford to lose.
          </p>
          <p className="text-xs text-muted-foreground">
            Peer-to-peer liquidity model • Provably fair games • 15% affiliate commissions
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
