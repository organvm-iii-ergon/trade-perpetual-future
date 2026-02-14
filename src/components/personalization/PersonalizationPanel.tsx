import { useState } from 'react'
import {
  Palette,
  Sparkles,
  Eye,
  Zap,
  Gauge,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePersistence } from '@/hooks/use-persistence'
import { VISUAL_THEMES, applyTheme, getTheme } from '@/lib/themes'
import { PERSONALIZATION_PRESETS, getPreset } from '@/lib/presets'
import type { VisualTheme, PersonalizationPreset } from '@/types'

export function PersonalizationPanel() {
  const [particlesEnabled, setParticlesEnabled] = usePersistence<boolean>('particles-enabled', true)
  const [particleIntensity, setParticleIntensity] = usePersistence<number>('particle-intensity', 1.0)
  const [glassIntensity, setGlassIntensity] = usePersistence<number>('glass-intensity', 1.0)
  const [animationSpeed, setAnimationSpeed] = usePersistence<number>('animation-speed', 1.0)
  const [backgroundIntensity, setBackgroundIntensity] = usePersistence<number>('background-intensity', 0.6)
  const [selectedTheme, setSelectedTheme] = usePersistence<string>('user-theme', 'cosmic')

  const [showPresets, setShowPresets] = useState(false)

  const handleThemeChange = (theme: VisualTheme) => {
    setSelectedTheme(theme.id)
    applyTheme(theme)
    toast.success(`Theme changed to ${theme.name}`)
  }

  const handlePresetApply = (preset: PersonalizationPreset) => {
    setParticlesEnabled(preset.settings.particlesEnabled)
    setParticleIntensity(preset.settings.particleIntensity)
    setGlassIntensity(preset.settings.glassIntensity)
    setAnimationSpeed(preset.settings.animationSpeed)
    setBackgroundIntensity(preset.settings.backgroundIntensity)
    toast.success(`Applied "${preset.name}" preset`)
    setShowPresets(false)
  }

  return (
    <div className="space-y-6">
      {/* Presets Section */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Presets
            </h3>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowPresets(!showPresets)}
            >
              {showPresets ? 'Hide' : 'Show'}
            </button>
          </div>

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {PERSONALIZATION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className="btn btn-outline btn-sm h-auto py-3 flex-col gap-1"
                      onClick={() => handlePresetApply(preset)}
                    >
                      <span className="font-bold">{preset.name}</span>
                      <span className="text-xs text-base-content/60 normal-case font-normal">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Visual Theme
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {VISUAL_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={cn(
                  'btn btn-sm h-auto py-3 flex-col items-start gap-1 text-left',
                  selectedTheme === theme.id
                    ? 'btn-primary'
                    : 'btn-ghost border border-base-300'
                )}
                onClick={() => handleThemeChange(theme)}
              >
                {/* Color Preview */}
                <div className="flex gap-1 mb-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.colors.gradientStart }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.colors.gradientMid }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.colors.gradientEnd }}
                  />
                </div>
                <span className="font-bold text-xs">{theme.name}</span>
                <span className="text-xs opacity-60 normal-case font-normal line-clamp-1">
                  {theme.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Particles Toggle */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Cursor Particles
          </h3>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-sm text-base-content">Enable Particles</p>
              <p className="text-xs text-base-content/60">
                Sparkle effects follow your cursor
              </p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={particlesEnabled}
              onChange={(e) => setParticlesEnabled(e.target.checked)}
            />
          </div>

          {particlesEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <label className="label">
                <span className="label-text text-sm">
                  Particle Intensity: {particleIntensity.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                className="range range-primary range-sm"
                min={0.1}
                max={2.0}
                step={0.1}
                value={particleIntensity}
                onChange={(e) => setParticleIntensity(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-base-content/60 mt-1">
                <span>Subtle</span>
                <span>Intense</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="divider" />

      {/* Glass Intensity */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Glass Effect
          </h3>

          <div className="mt-3">
            <label className="label">
              <span className="label-text text-sm">
                Glass Intensity: {glassIntensity.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              className="range range-secondary range-sm"
              min={0}
              max={2.0}
              step={0.1}
              value={glassIntensity}
              onChange={(e) => setGlassIntensity(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-xs text-base-content/60 mt-1">
              <span>Flat</span>
              <span>Maximum Blur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Speed */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Animation Speed
          </h3>

          <div className="mt-3">
            <label className="label">
              <span className="label-text text-sm">
                Speed: {animationSpeed.toFixed(1)}x
              </span>
            </label>
            <input
              type="range"
              className="range range-accent range-sm"
              min={0.2}
              max={2.0}
              step={0.1}
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-xs text-base-content/60 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Intensity */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Background Intensity
          </h3>

          <div className="mt-3">
            <label className="label">
              <span className="label-text text-sm">
                Intensity: {(backgroundIntensity * 100).toFixed(0)}%
              </span>
            </label>
            <input
              type="range"
              className="range range-primary range-sm"
              min={0}
              max={1.0}
              step={0.05}
              value={backgroundIntensity}
              onChange={(e) => setBackgroundIntensity(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-xs text-base-content/60 mt-1">
              <span>None</span>
              <span>Full</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
