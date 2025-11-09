import type { PersonalizationPreset } from './types'

export const PERSONALIZATION_PRESETS: PersonalizationPreset[] = [
  {
    id: 'quick',
    name: 'Quick',
    description: 'Minimal effects for faster performance and reduced visual complexity',
    settings: {
      particlesEnabled: false,
      particleIntensity: 0.5,
      glassIntensity: 0.5,
      animationSpeed: 1.5,
      backgroundIntensity: 0.3,
    }
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Optimized balance between visual appeal and performance',
    settings: {
      particlesEnabled: true,
      particleIntensity: 1.0,
      glassIntensity: 1.0,
      animationSpeed: 1.0,
      backgroundIntensity: 0.6,
    }
  },
  {
    id: 'maximum',
    name: 'Maximum',
    description: 'Full visual effects with maximum intensity and animations',
    settings: {
      particlesEnabled: true,
      particleIntensity: 1.8,
      glassIntensity: 1.4,
      animationSpeed: 0.8,
      backgroundIntensity: 1.0,
    }
  }
]

export function getPreset(id: 'quick' | 'balanced' | 'maximum'): PersonalizationPreset {
  return PERSONALIZATION_PRESETS.find(p => p.id === id) || PERSONALIZATION_PRESETS[1]
}
