import { useState } from 'react'

function RiskWarning() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="collapse collapse-arrow bg-warning text-warning-content mb-8">
      <input
        type="checkbox"
        checked={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
      />
      <div className="collapse-title text-xl font-medium">
        ⚠️ IMPORTANT: Risk Warning & Terms of Service
      </div>
      <div className="collapse-content">
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-base mb-2">Trading Risks</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Perpetual futures trading involves substantial risk of loss</li>
              <li>Leverage can amplify both gains and losses</li>
              <li>You may lose more than your initial investment</li>
              <li>Only trade with funds you can afford to lose</li>
              <li>Past performance does not guarantee future results</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-2">Non-Custodial Platform</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>This is a NON-CUSTODIAL platform - you control your funds</li>
              <li>All trades are executed through Drift Protocol smart contracts</li>
              <li>You sign all transactions with your wallet</li>
              <li>We do not have access to your private keys or funds</li>
              <li>You are responsible for securing your wallet and seed phrase</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-2">Terms of Service</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>By using this platform, you acknowledge the risks involved</li>
              <li>You are responsible for compliance with your local regulations</li>
              <li>This platform may not be available in all jurisdictions</li>
              <li>We earn referral fees through Drift Protocol's Builder Code system</li>
              <li>No investment advice is provided - do your own research</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-2">Technical Risks</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Smart contract risks exist despite audits</li>
              <li>Network congestion may affect transaction execution</li>
              <li>Slippage may occur during volatile market conditions</li>
              <li>Always verify transaction details before signing</li>
            </ul>
          </div>

          <div className="bg-base-100 p-4 rounded-lg mt-4">
            <p className="font-bold text-center">
              ⚠️ PROCEED ONLY IF YOU UNDERSTAND AND ACCEPT THESE RISKS ⚠️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskWarning
