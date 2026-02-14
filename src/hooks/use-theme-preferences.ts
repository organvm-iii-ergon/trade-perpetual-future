import { useEffect } from 'react'
import { usePersistence } from '@/hooks/use-persistence'
import { getTheme, applyTheme } from '@/lib/themes'

export function useThemePreferences() {
  const [themeId] = usePersistence<string>('user-theme', 'cosmic')
  const [glassIntensity] = usePersistence<number>('glass-intensity', 1.0)
  const [animationSpeed] = usePersistence<number>('animation-speed', 1.0)

  useEffect(() => {
    const theme = getTheme(themeId ?? 'cosmic')
    if (theme) {
      applyTheme(theme)
    }

    const root = document.documentElement
    const glassIntensityVal = glassIntensity ?? 1.0
    root.style.setProperty('--glass-blur', `${16 * glassIntensityVal}px`)
    root.style.setProperty('--glass-opacity', `${0.4 * glassIntensityVal}`)

    const animationSpeedVal = animationSpeed ?? 1.0
    root.style.setProperty('--animation-speed', `${animationSpeedVal}`)
  }, [themeId, glassIntensity, animationSpeed])

  return {
    theme: themeId ?? 'cosmic',
    glassIntensity: glassIntensity ?? 1.0,
    animationSpeed: animationSpeed ?? 1.0,
  }
}
