import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiceThree, CoinVertical, ChartLineUp } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Game } from '@/lib/types'
import { calculateGamePayout, GAME_FEE_PERCENT } from '@/lib/game-logic'

interface GamesTabProps {
  balance: number
  onCreateGame: (type: Game['type'], wager: number) => void
  onJoinGame: (gameId: string) => void
  activeGames: Game[]
  username: string
}

export function GamesTab({ balance, onCreateGame, onJoinGame, activeGames, username }: GamesTabProps) {
  const [selectedGame, setSelectedGame] = useState<Game['type']>('dice')
  const [wager, setWager] = useState('')

  const wagerNum = parseFloat(wager) || 0
  const potentialWin = calculateGamePayout(wagerNum)
  const canCreate = wagerNum >= 1 && wagerNum <= balance

  const handleCreate = () => {
    if (canCreate) {
      onCreateGame(selectedGame, wagerNum)
      setWager('')
      toast.success('Game created! Waiting for opponent...')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DiceThree size={28} weight="fill" />
          PvP Games
        </h2>
        <p className="text-muted-foreground mt-1">Challenge players in provably fair games</p>
      </div>

      <Tabs value={selectedGame} onValueChange={(v) => setSelectedGame(v as Game['type'])}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dice" className="gap-2">
            <DiceThree size={20} />
            Dice
          </TabsTrigger>
          <TabsTrigger value="coinflip" className="gap-2">
            <CoinVertical size={20} />
            Coinflip
          </TabsTrigger>
          <TabsTrigger value="price-prediction" className="gap-2">
            <ChartLineUp size={20} />
            Price
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dice" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Dice Roll</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Both players roll a dice. Highest roll wins the pot. Tie = both get refund.
            </p>
            <CreateGameForm
              wager={wager}
              setWager={setWager}
              balance={balance}
              potentialWin={potentialWin}
              canCreate={canCreate}
              onCreate={handleCreate}
            />
          </Card>
        </TabsContent>

        <TabsContent value="coinflip" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Coin Flip</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Call heads or tails. 50/50 chance. Winner takes the pot.
            </p>
            <CreateGameForm
              wager={wager}
              setWager={setWager}
              balance={balance}
              potentialWin={potentialWin}
              canCreate={canCreate}
              onCreate={handleCreate}
            />
          </Card>
        </TabsContent>

        <TabsContent value="price-prediction" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Price Prediction</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Predict if BTC price goes up or down in 60 seconds. Closest prediction wins.
            </p>
            <CreateGameForm
              wager={wager}
              setWager={setWager}
              balance={balance}
              potentialWin={potentialWin}
              canCreate={canCreate}
              onCreate={handleCreate}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <div>
        <h3 className="font-semibold text-lg mb-4">Open Games</h3>
        {activeGames.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p className="text-muted-foreground">No open games</p>
            <p className="text-sm text-muted-foreground mt-1">Create a game to get started</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeGames.filter(g => g.status === 'waiting').map((game) => (
              <Card key={game.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {game.type === 'dice' && <DiceThree size={12} />}
                      {game.type === 'coinflip' && <CoinVertical size={12} />}
                      {game.type === 'price-prediction' && <ChartLineUp size={12} />}
                      {game.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {game.creatorId === username ? 'You' : game.creatorId}
                    </span>
                  </div>
                  <Badge variant="outline">Waiting</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wager</span>
                    <span className="font-mono">${game.wager.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potential Win</span>
                    <span className="font-mono text-long">
                      ${calculateGamePayout(game.wager).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={game.creatorId === username || balance < game.wager}
                  onClick={() => onJoinGame(game.id)}
                >
                  {game.creatorId === username ? 'Waiting for Opponent' : 'Join Game'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface CreateGameFormProps {
  wager: string
  setWager: (v: string) => void
  balance: number
  potentialWin: number
  canCreate: boolean
  onCreate: () => void
}

function CreateGameForm({ wager, setWager, balance, potentialWin, canCreate, onCreate }: CreateGameFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="wager">Wager Amount (USD)</Label>
        <Input
          id="wager"
          type="number"
          placeholder="0.00"
          value={wager}
          onChange={(e) => setWager(e.target.value)}
          step="0.01"
          min="1"
          className="font-mono mt-2"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Min: $1.00</span>
          <span>Available: ${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Your Wager</span>
          <span className="font-mono">${parseFloat(wager || '0').toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee ({(GAME_FEE_PERCENT * 100).toFixed(0)}%)</span>
          <span className="font-mono">${(parseFloat(wager || '0') * 2 * GAME_FEE_PERCENT).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Potential Win</span>
          <span className="font-mono text-long">${potentialWin.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full"
        disabled={!canCreate}
        onClick={onCreate}
      >
        Create Game
      </Button>
    </div>
  )
}
