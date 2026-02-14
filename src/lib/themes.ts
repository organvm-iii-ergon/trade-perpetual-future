import type { VisualTheme } from '@/types'

export const VISUAL_THEMES: VisualTheme[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Deep space blues and purples with stellar accents',
    colors: {
      background: 'oklch(0.15 0.02 250)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.30 0.08 250)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.20 0.08 250)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.35 0.06 250)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.70 0.15 200)',
      accentForeground: 'oklch(0.15 0.02 250)',
      muted: 'oklch(0.35 0.06 250)',
      mutedForeground: 'oklch(0.65 0.04 240)',
      border: 'oklch(0.35 0.08 245)',
      gradientStart: 'oklch(0.20 0.08 250)',
      gradientMid: 'oklch(0.40 0.12 280)',
      gradientEnd: 'oklch(0.30 0.10 200)',
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and pinks with golden highlights',
    colors: {
      background: 'oklch(0.18 0.04 30)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.28 0.10 35)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.22 0.09 30)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.38 0.08 40)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.72 0.20 50)',
      accentForeground: 'oklch(0.18 0.04 30)',
      muted: 'oklch(0.38 0.08 35)',
      mutedForeground: 'oklch(0.68 0.06 30)',
      border: 'oklch(0.38 0.10 35)',
      gradientStart: 'oklch(0.22 0.09 30)',
      gradientMid: 'oklch(0.45 0.15 50)',
      gradientEnd: 'oklch(0.35 0.12 15)',
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea teals and aqua with wave-like transitions',
    colors: {
      background: 'oklch(0.16 0.03 200)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.26 0.09 195)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.20 0.08 200)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.36 0.07 190)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.68 0.18 195)',
      accentForeground: 'oklch(0.16 0.03 200)',
      muted: 'oklch(0.36 0.07 195)',
      mutedForeground: 'oklch(0.66 0.05 200)',
      border: 'oklch(0.36 0.09 195)',
      gradientStart: 'oklch(0.20 0.08 200)',
      gradientMid: 'oklch(0.38 0.14 190)',
      gradientEnd: 'oklch(0.28 0.11 210)',
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones with organic feel',
    colors: {
      background: 'oklch(0.17 0.03 145)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.27 0.08 150)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.21 0.07 145)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.37 0.06 155)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.70 0.16 150)',
      accentForeground: 'oklch(0.17 0.03 145)',
      muted: 'oklch(0.37 0.06 150)',
      mutedForeground: 'oklch(0.67 0.05 145)',
      border: 'oklch(0.37 0.08 150)',
      gradientStart: 'oklch(0.21 0.07 145)',
      gradientMid: 'oklch(0.40 0.12 160)',
      gradientEnd: 'oklch(0.30 0.10 135)',
    }
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Ethereal greens and cyans with magical shimmer',
    colors: {
      background: 'oklch(0.16 0.03 180)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.28 0.09 175)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.21 0.08 180)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.38 0.07 170)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.69 0.17 185)',
      accentForeground: 'oklch(0.16 0.03 180)',
      muted: 'oklch(0.38 0.07 175)',
      mutedForeground: 'oklch(0.68 0.06 180)',
      border: 'oklch(0.38 0.09 175)',
      gradientStart: 'oklch(0.21 0.08 180)',
      gradientMid: 'oklch(0.42 0.13 170)',
      gradientEnd: 'oklch(0.32 0.11 195)',
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Electric pinks and purples with vibrant energy',
    colors: {
      background: 'oklch(0.14 0.04 320)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.26 0.10 315)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.19 0.09 320)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.34 0.08 310)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.71 0.22 330)',
      accentForeground: 'oklch(0.14 0.04 320)',
      muted: 'oklch(0.34 0.08 315)',
      mutedForeground: 'oklch(0.64 0.06 320)',
      border: 'oklch(0.34 0.10 315)',
      gradientStart: 'oklch(0.19 0.09 320)',
      gradientMid: 'oklch(0.43 0.16 300)',
      gradientEnd: 'oklch(0.33 0.13 340)',
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean monochrome with subtle grays',
    colors: {
      background: 'oklch(0.16 0.01 250)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.24 0.02 250)',
      cardForeground: 'oklch(0.95 0 0)',
      primary: 'oklch(0.20 0.02 250)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.32 0.02 250)',
      secondaryForeground: 'oklch(0.95 0 0)',
      accent: 'oklch(0.65 0.05 250)',
      accentForeground: 'oklch(0.16 0.01 250)',
      muted: 'oklch(0.32 0.02 250)',
      mutedForeground: 'oklch(0.62 0.02 250)',
      border: 'oklch(0.32 0.03 250)',
      gradientStart: 'oklch(0.20 0.02 250)',
      gradientMid: 'oklch(0.35 0.03 250)',
      gradientEnd: 'oklch(0.27 0.03 250)',
    }
  }
]

export function getTheme(id: string): VisualTheme | undefined {
  return VISUAL_THEMES.find(t => t.id === id)
}

export function applyTheme(theme: VisualTheme) {
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVar}`, value)
  })
}
