import { Wallet, TrendingUp, Dice3, Share2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SignInPageProps {
  onConnect: () => void
}

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Perpetual Futures',
    description: 'Trade leveraged perpetual contracts on Solana with deep liquidity via Drift Protocol.',
  },
  {
    icon: Dice3,
    title: 'Gamified Trading',
    description: 'Compete in prediction games, dice rolls, and challenges to earn bonus rewards.',
  },
  {
    icon: Share2,
    title: 'Affiliate Rewards',
    description: 'Share your referral link and earn commissions on referred trading volume.',
  },
  {
    icon: Users,
    title: 'Social Trading',
    description: 'Follow trending hashtags, track sentiment, and trade alongside the community.',
  },
]

export function SignInPage({ onConnect }: SignInPageProps) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Animated Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg space-y-8"
      >
        {/* Logo / Title */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-4"
          >
            <span className="text-4xl">💥</span>
          </motion.div>

          <h1 className="text-4xl font-bold text-base-content tracking-tight">
            Bang Perp Exchange
          </h1>
          <p className="text-base-content/60 text-lg">
            Trade Solana perpetual futures powered by Drift Protocol.
            Non-custodial. Your keys, your funds.
          </p>
        </div>

        {/* Connect Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <button
            className="btn btn-primary btn-lg gap-3 w-full max-w-xs text-lg"
            onClick={onConnect}
          >
            <Wallet className="h-6 w-6" />
            Connect Wallet
          </button>
          <p className="text-xs text-base-content/60 mt-3 text-center">
            Connect your Solana wallet to start trading on Drift Protocol
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card bg-base-200"
              >
                <div className="card-body p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-base-content">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-base-content/60 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-base-content/60 pt-4"
        >
          By connecting your wallet, you agree to the terms of service.
          Trading involves risk. Only trade what you can afford to lose.
        </motion.p>
      </motion.div>
    </div>
  )
}
