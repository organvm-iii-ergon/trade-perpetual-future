import { User } from '@drift-labs/sdk-browser'
import RiskWarning from '@/components/common/RiskWarning'
import DashboardPanel from '@/components/analytics/DashboardPanel'
import PnLAnalytics from '@/components/analytics/PnLAnalytics'
import Soothsayer from '@/components/common/Soothsayer'

interface DashboardTabProps {
  user: User | null
}

export default function DashboardTab({ user }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <RiskWarning />
      <DashboardPanel user={user} />
      <div className="grid lg:grid-cols-2 gap-6">
        <PnLAnalytics user={user} />
        <Soothsayer />
      </div>
    </div>
  )
}
