import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GithubLogo, TrendUp, Users, DiceThree, ShareNetwork } from '@phosphor-icons/react'

interface SignInPageProps {
  onSignIn: () => void
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-5xl font-bold tracking-tight">Bang Perp Exchange</h1>
          <p className="text-xl text-muted-foreground">
            Social Trading Platform with Live Markets, PvP Games & Affiliate Rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-long/20">
                <TrendUp size={24} className="text-long" />
              </div>
              <div>
                <h3 className="font-semibold">Live Trading</h3>
                <p className="text-sm text-muted-foreground">Real-time perpetual futures</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Trade BTC, ETH, and SOL with up to 20x leverage on live markets with peer-to-peer liquidity.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber/20">
                <DiceThree size={24} className="text-amber" weight="fill" />
              </div>
              <div>
                <h3 className="font-semibold">PvP Games</h3>
                <p className="text-sm text-muted-foreground">Dice, Coinflip, Predictions</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Challenge other players in provably fair games with instant payouts.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan/20">
                <ShareNetwork size={24} className="text-cyan" />
              </div>
              <div>
                <h3 className="font-semibold">Affiliate Program</h3>
                <p className="text-sm text-muted-foreground">Earn on every referral</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Get 15% commission on all trading fees from users you refer. Build your network.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Leaderboards</h3>
                <p className="text-sm text-muted-foreground">Compete & climb ranks</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your performance against top traders and earn achievements.
            </p>
          </Card>
        </div>

        <Card className="p-8 text-center space-y-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to Start Trading?</h2>
            <p className="text-muted-foreground">
              Sign in with your GitHub account to access all features
            </p>
          </div>
          <Button
            size="lg"
            className="gap-3 text-lg h-14 px-8"
            onClick={onSignIn}
          >
            <GithubLogo size={24} weight="fill" />
            Sign In with GitHub
          </Button>
          <p className="text-xs text-muted-foreground">
            No credit card required • Start with demo balance • Trade responsibly
          </p>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">⚠️ Trading involves risk. Only trade what you can afford to lose.</p>
          <p>All trades are peer-to-peer. No house funding model.</p>
        </div>
      </div>
    </div>
  )
}
