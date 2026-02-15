import { AffiliateTab } from '@/components/social/AffiliateTab'
import { HashtagPanel } from '@/components/social/HashtagPanel'
import type { UserProfile, AffiliateStats, HashtagTrend } from '@/types'

interface SocialTabProps {
  profile: UserProfile
  stats: AffiliateStats
  hashtags: HashtagTrend[]
}

export default function SocialTab({ profile, stats, hashtags }: SocialTabProps) {
  return (
    <div className="space-y-6">
      <AffiliateTab profile={profile} stats={stats} />
      {hashtags.length > 0 && <HashtagPanel hashtags={hashtags} />}
    </div>
  )
}
