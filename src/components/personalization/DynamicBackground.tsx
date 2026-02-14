import { useEffect, useRef } from 'react'
import { usePersistence } from '@/hooks/use-persistence'
import { getTheme } from '@/lib/themes'

interface DynamicBackgroundProps {
  className?: string
}

export function DynamicBackground({ className }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [theme] = usePersistence<string>('user-theme', 'cosmic')
  const [backgroundIntensity] = usePersistence<number>('background-intensity', 0.6)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const themeData = getTheme(theme ?? 'cosmic')
    if (!themeData) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Animated particles / gradient orbs
    interface Orb {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
    }

    const orbs: Orb[] = []
    const orbColors = [
      themeData.colors.gradientStart,
      themeData.colors.gradientMid,
      themeData.colors.gradientEnd,
      themeData.colors.accent,
    ]

    for (let i = 0; i < 6; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 80 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: orbColors[i % orbColors.length],
      })
    }

    const intensity = backgroundIntensity ?? 0.6

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each orb as a radial gradient
      for (const orb of orbs) {
        orb.x += orb.vx
        orb.y += orb.vy

        // Bounce off edges
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        )

        // Parse oklch color and apply with reduced alpha for glow effect
        gradient.addColorStop(0, `color-mix(in oklch, ${orb.color} ${Math.round(intensity * 30)}%, transparent)`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fillRect(
          orb.x - orb.radius,
          orb.y - orb.radius,
          orb.radius * 2,
          orb.radius * 2
        )
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [theme, backgroundIntensity])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
