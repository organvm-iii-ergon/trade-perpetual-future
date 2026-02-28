import { describe, it, expect } from 'vitest';
import { PERSONALIZATION_PRESETS, getPreset } from './presets';

describe('PERSONALIZATION_PRESETS', () => {
  it('has 3 presets', () => {
    expect(PERSONALIZATION_PRESETS).toHaveLength(3);
  });

  it('has unique IDs', () => {
    const ids = PERSONALIZATION_PRESETS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each preset has required fields', () => {
    PERSONALIZATION_PRESETS.forEach(preset => {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.settings).toBeDefined();
      expect(typeof preset.settings.particlesEnabled).toBe('boolean');
      expect(typeof preset.settings.particleIntensity).toBe('number');
      expect(typeof preset.settings.glassIntensity).toBe('number');
      expect(typeof preset.settings.animationSpeed).toBe('number');
      expect(typeof preset.settings.backgroundIntensity).toBe('number');
    });
  });

  it('quick preset disables particles', () => {
    const quick = PERSONALIZATION_PRESETS.find(p => p.id === 'quick');
    expect(quick!.settings.particlesEnabled).toBe(false);
  });

  it('maximum preset has highest particle intensity', () => {
    const max = PERSONALIZATION_PRESETS.find(p => p.id === 'maximum');
    const balanced = PERSONALIZATION_PRESETS.find(p => p.id === 'balanced');
    expect(max!.settings.particleIntensity).toBeGreaterThan(balanced!.settings.particleIntensity);
  });
});

describe('getPreset', () => {
  it('returns quick preset', () => {
    expect(getPreset('quick').id).toBe('quick');
  });

  it('returns balanced preset', () => {
    expect(getPreset('balanced').id).toBe('balanced');
  });

  it('returns maximum preset', () => {
    expect(getPreset('maximum').id).toBe('maximum');
  });

  it('returns balanced as default for unknown id', () => {
    const result = getPreset('nonexistent' as any);
    expect(result.id).toBe('balanced');
  });
});
