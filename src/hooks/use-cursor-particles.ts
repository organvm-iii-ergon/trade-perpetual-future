import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

export function useCursorParticles(enabled: boolean = true) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!enabled) return

    let animationFrameId: number
    let lastTime = Date.now()
    let particleId = 0

    const colors = [
      'oklch(0.70 0.25 285)',
      'oklch(0.75 0.20 320)',
      'oklch(0.75 0.18 220)',
      'oklch(0.80 0.18 75)',
    ]

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < 30) return
      lastTime = now

      const newParticles: Particle[] = []
      for (let i = 0; i < 2; i++) {
        newParticles.push({
          id: particleId++,
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 0,
          maxLife: 60 + Math.random() * 60,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      setParticles((prev) => [...prev, ...newParticles].slice(-100))
    }

    const animate = () => {
      setParticles((prev) => {
        return prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1,
            vy: p.vy + 0.1,
          }))
          .filter((p) => p.life < p.maxLife)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [enabled])

  return particles
}
