import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Copy, ShareNetwork, Users, CurrencyDollar } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { AffiliateStats } from '@/lib/types'
import { getTierIcon, getTierColor } from '@/lib/affiliate'

interface AffiliateTabProps {
  stats: AffiliateStats
  userTier: string
}

export function AffiliateTab({ stats, userTier }: AffiliateTabProps) {
  const referralLink = `${window.location.origin}?ref=${stats.referralCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShareNetwork size={28} weight="fill" />
            Affiliate Program
          </h2>
          <p className="text-muted-foreground mt-1">Earn 15% commission on referrals</p>
        </div>
        <Badge variant="secondary" className="gap-2 text-lg px-4 py-2">
          <span className="text-2xl">{getTierIcon(userTier)}</span>
          <span className={getTierColor(userTier)}>{userTier.toUpperCase()}</span>
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <CurrencyDollar size={24} className="text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Earned</span>
          </div>
          <div className="font-mono text-3xl font-bold">${stats.totalCommissions.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">Lifetime commissions</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan/20">
              <Users size={24} className="text-cyan" />
            </div>
            <span className="text-sm text-muted-foreground">Referrals</span>
          </div>
          <div className="font-mono text-3xl font-bold">{stats.totalReferrals}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.activeReferrals} active traders
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-long/20">
              <CurrencyDollar size={24} className="text-long" />
            </div>
            <span className="text-sm text-muted-foreground">Referral Volume</span>
          </div>
          <div className="font-mono text-3xl font-bold">
            ${(stats.lifetimeVolume / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total trading volume</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Your Referral Link</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="referral-link">Share this link to earn commissions</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="referral-link"
                value={referralLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyLink} className="gap-2 shrink-0">
                <Copy size={16} />
                Copy
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Share your unique referral link with friends</li>
              <li>• They sign up and start trading</li>
              <li>• You earn 15% of their trading fees forever</li>
              <li>• No limits on earnings or referrals</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Commission Tiers</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-3xl mb-2">🥉</div>
            <div className="font-semibold">Bronze</div>
            <div className="text-xs text-muted-foreground mt-1">Start here</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-semibold">Silver</div>
            <div className="text-xs text-muted-foreground mt-1">$10K+ volume</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-3xl mb-2">👑</div>
            <div className="font-semibold">Gold</div>
            <div className="text-xs text-muted-foreground mt-1">$100K+ volume</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-3xl mb-2">💎</div>
            <div className="font-semibold">Platinum</div>
            <div className="text-xs text-muted-foreground mt-1">$1M+ volume</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
