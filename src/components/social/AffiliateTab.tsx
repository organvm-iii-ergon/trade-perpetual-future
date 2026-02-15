import { useState } from 'react'
import { Copy, Share2, Users, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { UserProfile, AffiliateStats } from '@/types'
import {
  generateReferralCode,
  getUserTier,
  getTierColor,
  getTierIcon,
  AFFILIATE_COMMISSION_RATE,
} from '@/lib/affiliate'

interface AffiliateTabProps {
  profile: UserProfile
  stats: AffiliateStats
}

export function AffiliateTab({ profile, stats }: AffiliateTabProps) {
  const [copied, setCopied] = useState(false)

  const referralCode = profile.referralCode || generateReferralCode(profile.userId)
  const referralLink = `${window.location.origin}?ref=${referralCode}`
  const tier = getUserTier(profile)
  const tierColor = getTierColor(tier)
  const tierIcon = getTierIcon(tier)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('Referral link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Trade Perpetual Futures',
          text: `Join me on Bang Perp Exchange! Use my referral code: ${referralCode}`,
          url: referralLink,
        })
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="space-y-6">
      {/* Tier Display */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-base-content">Your Tier</h3>
              <p className="text-base-content/60 text-sm">
                Based on total volume and affiliate earnings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{tierIcon}</span>
              <span className={cn('text-xl font-bold capitalize', tierColor)}>
                {tier}
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Commission Rate */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-base-content/70" />
            <div>
              <p className="text-sm font-semibold text-base-content">
                Commission Rate
              </p>
              <p className="text-base-content/60 text-xs">
                {(AFFILIATE_COMMISSION_RATE * 100).toFixed(0)}% of referred trading fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <input
              type="text"
              className="input input-bordered flex-1 text-sm font-mono"
              value={referralLink}
              readOnly
            />
            <div className="flex gap-2">
              <button
                className={cn(
                  'btn flex-1 sm:flex-none',
                  copied ? 'btn-success' : 'btn-primary'
                )}
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="btn btn-secondary flex-1 sm:flex-none" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="mt-2">
            <label className="label">
              <span className="label-text text-base-content/60">
                Referral Code
              </span>
            </label>
            <span className="badge badge-primary badge-lg font-mono tracking-wider">
              {referralCode}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-200"
        >
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold text-base-content">
              {stats.totalReferrals}
            </p>
            <p className="text-xs text-base-content/60">
              {stats.activeReferrals} active
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-200"
        >
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-success">
              ${stats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-base-content/60">
              ${stats.earningsThisMonth.toLocaleString()} this month
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-base-200"
        >
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Total Commissions</span>
            </div>
            <p className="text-2xl font-bold text-base-content">
              ${stats.totalCommissions.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-200"
        >
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <Users className="h-4 w-4" />
              <span className="text-xs">Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold text-base-content">
              {stats.conversionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-base-content/60">
              ${stats.lifetimeVolume.toLocaleString()} volume
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
