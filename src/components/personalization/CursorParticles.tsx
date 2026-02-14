import { useCursorParticles } from '@/hooks/use-cursor-particles'

interface CursorParticlesProps {
  enabled?: boolean
  intensity?: number
}

export function CursorParticles({ enabled = true, intensity = 1.0 }: CursorParticlesProps) {
  const particles = useCursorParticles(enabled)

  if (!enabled || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {particles.map((particle) => {
        const progress = particle.life / particle.maxLife
        const opacity = (1 - progress) * intensity
        const scale = (1 - progress * 0.5) * intensity

        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size * scale,
              height: particle.size * scale,
              backgroundColor: particle.color,
              opacity,
              transform: `translate(-50%, -50%)`,
              willChange: 'transform, opacity',
            }}
          />
        )
      })}
    </div>
  )
}
