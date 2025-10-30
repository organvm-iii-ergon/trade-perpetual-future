import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GithubLogo, TrendUp, Users, DiceThree, ShareNetwork } from '@phosphor-icons/react'

interface SignInPageProps {
  onSignIn: () => void
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-slide-up">
          <div className="text-7xl mb-4 animate-pulse-glow inline-block">💥</div>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-cyan bg-clip-text text-transparent">
            Bang Perp Exchange
          </h1>
          <p className="text-xl text-foreground/90">
            Social Trading Platform with Live Markets, PvP Games & Affiliate Rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="glass-strong rounded-3xl p-6 space-y-4 glass-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-long/30 backdrop-blur-sm">
                <TrendUp size={28} className="text-long" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Live Trading</h3>
                <p className="text-sm text-foreground/70">Real-time perpetual futures</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              Trade BTC, ETH, and SOL with up to 20x leverage on live markets with peer-to-peer liquidity.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-6 space-y-4 glass-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber/30 backdrop-blur-sm">
                <DiceThree size={28} className="text-amber" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">PvP Games</h3>
                <p className="text-sm text-foreground/70">Dice, Coinflip, Predictions</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              Challenge other players in provably fair games with instant payouts.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-6 space-y-4 glass-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan/30 backdrop-blur-sm">
                <ShareNetwork size={28} className="text-cyan" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Affiliate Program</h3>
                <p className="text-sm text-foreground/70">Earn on every referral</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              Get 15% commission on all trading fees from users you refer. Build your network.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-6 space-y-4 glass-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/30 backdrop-blur-sm">
                <Users size={28} className="text-primary" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Leaderboards</h3>
                <p className="text-sm text-foreground/70">Compete & climb ranks</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              Track your performance against top traders and earn achievements.
            </p>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 text-center space-y-6 mt-8 animate-slide-up border border-white/20">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to Start Trading?</h2>
            <p className="text-foreground/80">
              Sign in with your GitHub account to access all features
            </p>
          </div>
          <Button
            size="lg"
            className="gap-3 text-lg h-14 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
            onClick={onSignIn}
          >
            <GithubLogo size={28} weight="fill" />
            Sign In with GitHub
          </Button>
          <p className="text-xs text-foreground/70">
            No credit card required • Start with demo balance • Trade responsibly
          </p>
        </div>

        <div className="text-center text-sm text-foreground/70">
          <p className="mb-2">⚠️ Trading involves risk. Only trade what you can afford to lose.</p>
          <p>All trades are peer-to-peer. No house funding model.</p>
        </div>
      </div>
    </div>
  )
}
