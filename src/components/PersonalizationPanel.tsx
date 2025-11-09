import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Palette, 
  Sparkle, 
  Eye, 
  Lightning,
  Atom,
  Fire,
  Sun,
  Drop,
  Tree,
  Mountains,
  Gauge
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { VISUAL_THEMES, applyTheme, getTheme } from '@/lib/themes'
import { PERSONALIZATION_PRESETS } from '@/lib/presets'

export function PersonalizationPanel() {
  const [particlesEnabled, setParticlesEnabled] = useKV<boolean>('particles-enabled', true)
  const [particleIntensity, setParticleIntensity] = useKV<number>('particle-intensity', 1.0)
  const [glassIntensity, setGlassIntensity] = useKV<number>('glass-intensity', 1.0)
  const [animationSpeed, setAnimationSpeed] = useKV<number>('animation-speed', 1.0)
  const [backgroundIntensity, setBackgroundIntensity] = useKV<number>('background-intensity', 0.6)
  const [selectedThemeId, setSelectedThemeId] = useKV<string>('user-theme', 'cosmic')

  useEffect(() => {
    const theme = getTheme(selectedThemeId || 'cosmic')
    if (theme) {
      applyTheme(theme)
    }
  }, [selectedThemeId])

  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId)
    const theme = getTheme(themeId)
    if (theme) {
      applyTheme(theme)
      toast.success(`Theme changed to ${theme.name}`)
    }
  }

  const handlePresetApply = (presetId: 'quick' | 'balanced' | 'maximum') => {
    const preset = PERSONALIZATION_PRESETS.find(p => p.id === presetId)
    if (!preset) return

    setParticlesEnabled(preset.settings.particlesEnabled)
    setParticleIntensity(preset.settings.particleIntensity)
    setGlassIntensity(preset.settings.glassIntensity)
    setAnimationSpeed(preset.settings.animationSpeed)
    setBackgroundIntensity(preset.settings.backgroundIntensity)
    
    toast.success(`Applied ${preset.name} preset`)
  }

  const themeIcons: Record<string, any> = {
    cosmic: Atom,
    sunset: Sun,
    ocean: Drop,
    forest: Tree,
    aurora: Mountains,
    neon: Lightning,
    minimal: Eye
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Palette size={28} weight="duotone" className="text-ai-purple" />
          Personalization
        </h3>
        <p className="text-foreground/70">
          Customize your trading experience with themes, effects, and visual preferences
        </p>
      </div>

      <Card className="glass-strong p-6 border-white/10">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Quick Presets</Label>
              <Gauge size={20} weight="duotone" className="text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PERSONALIZATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetApply(preset.id)}
                  className="glass-interactive p-4 rounded-xl border border-white/10 text-left transition-all hover:border-accent/50"
                >
                  <div className="font-semibold text-sm mb-1">{preset.name}</div>
                  <div className="text-xs text-foreground/60 leading-tight">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <Label className="text-base font-semibold mb-4 block">Visual Themes</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {VISUAL_THEMES.map((theme) => {
                const Icon = themeIcons[theme.id] || Sparkle
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`glass-interactive p-4 rounded-2xl border-2 transition-all ${
                      selectedThemeId === theme.id
                        ? 'border-accent shadow-lg shadow-accent/30' 
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.gradientStart}, ${theme.colors.gradientMid}, ${theme.colors.gradientEnd})`
                        }}
                      >
                        <Icon size={24} weight="duotone" className="text-white" />
                      </div>
                      <span className="font-semibold text-sm text-center">{theme.name}</span>
                      <span className="text-xs text-foreground/60 text-center leading-tight">{theme.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <Label className="text-base font-semibold">Fine Tuning</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="particles" className="font-semibold">Cursor Particles</Label>
                <p className="text-xs text-foreground/60">Interactive particle trail following cursor</p>
              </div>
              <Switch 
                id="particles"
                checked={particlesEnabled ?? true}
                onCheckedChange={setParticlesEnabled}
              />
            </div>

            {particlesEnabled && (
              <div className="space-y-2 ml-4 pl-4 border-l-2 border-white/10">
                <Label className="text-sm">Particle Intensity: {((particleIntensity ?? 1) * 100).toFixed(0)}%</Label>
                <Slider
                  value={[particleIntensity ?? 1]}
                  onValueChange={(v) => setParticleIntensity(v[0])}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-semibold">Glass Effect: {((glassIntensity ?? 1) * 100).toFixed(0)}%</Label>
              <p className="text-xs text-foreground/60 mb-2">Adjust blur and transparency of glassmorphic elements</p>
              <Slider
                value={[glassIntensity ?? 1]}
                onValueChange={(v) => setGlassIntensity(v[0])}
                min={0.3}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Animation Speed: {((animationSpeed ?? 1) * 100).toFixed(0)}%</Label>
              <p className="text-xs text-foreground/60 mb-2">Control the speed of UI animations and transitions</p>
              <Slider
                value={[animationSpeed ?? 1]}
                onValueChange={(v) => setAnimationSpeed(v[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Background Intensity: {((backgroundIntensity ?? 0.6) * 100).toFixed(0)}%</Label>
              <p className="text-xs text-foreground/60 mb-2">Dynamic background animation strength</p>
              <Slider
                value={[backgroundIntensity ?? 0.6]}
                onValueChange={(v) => setBackgroundIntensity(v[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass p-4 border-white/10">
        <div className="flex items-start gap-3">
          <Fire size={20} weight="duotone" className="text-amber mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">Pro Tip</p>
            <p className="text-xs text-foreground/70">
              Your preferences are saved automatically and persist across sessions. Try Quick presets for instant changes, or fine-tune each setting individually!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
