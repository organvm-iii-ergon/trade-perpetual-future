import { Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Reality } from '@/types'

interface RealityCardProps {
  reality: Reality
  index: number
}

export function RealityCard({ reality, index }: RealityCardProps) {
  const sentimentEmoji = {
    bullish: '\u{1F4C8}',
    bearish: '\u{1F4C9}',
    neutral: '\u27A1\uFE0F',
    volatile: '\u26A1'
  }

  return (
    <div
      className="card bg-base-200 p-6 animate-fade-in-stagger"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{sentimentEmoji[reality.sentiment]}</span>
            <h3 className="font-semibold text-lg">{reality.label}</h3>
          </div>
          <p className="text-sm text-base-content/60">{reality.description}</p>
        </div>
        <span className="badge badge-ghost ml-2 font-mono font-bold text-lg">
          {reality.probability}%
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-base-content/60">Probability</span>
          <span className="font-mono">{reality.probability}%</span>
        </div>
        <progress className="progress progress-primary w-full" value={reality.probability} max={100} />
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={reality.pricePoints}>
            <XAxis
              dataKey="time"
              stroke="oklch(0.65 0.04 240)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="oklch(0.65 0.04 240)"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.25 0.06 250)',
                border: '1px solid oklch(0.35 0.08 245)',
                borderRadius: '0.5rem',
                color: 'oklch(0.95 0 0)'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={reality.color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-base-content/60">
        <Sparkles size={14} className="text-purple-400" />
        <span>AI-Generated Projection</span>
      </div>
    </div>
  )
}
