import { DriftClient, User } from '@drift-labs/sdk-browser'
import TradePanel from '@/components/trading/TradePanel'
import PositionPanel from '@/components/trading/PositionPanel'
import OrderHistory from '@/components/trading/OrderHistory'

interface TradingTabProps {
  driftClient: DriftClient | null
  user: User | null
  isInitializing: boolean
  status: string
  markets: any[]
}

export default function TradingTab({ driftClient, user, isInitializing, status, markets }: TradingTabProps) {
  return (
    <div className="space-y-6">
      <TradePanel
        driftClient={driftClient}
        user={user}
        isInitializing={isInitializing}
        status={status}
        markets={markets}
      />
      <PositionPanel user={user} driftClient={driftClient} />
      <OrderHistory user={user} />
    </div>
  )
}
