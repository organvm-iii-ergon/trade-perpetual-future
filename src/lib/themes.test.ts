import { describe, it, expect } from 'vitest';
import { VISUAL_THEMES, getTheme } from './themes';

describe('VISUAL_THEMES', () => {
  it('has 7 themes', () => {
    expect(VISUAL_THEMES).toHaveLength(7);
  });

  it('has unique IDs', () => {
    const ids = VISUAL_THEMES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes expected themes', () => {
    const ids = VISUAL_THEMES.map(t => t.id);
    expect(ids).toContain('cosmic');
    expect(ids).toContain('sunset');
    expect(ids).toContain('ocean');
    expect(ids).toContain('forest');
    expect(ids).toContain('aurora');
    expect(ids).toContain('neon');
    expect(ids).toContain('minimal');
  });

  it('each theme has required color properties', () => {
    const requiredColors = [
      'background', 'foreground', 'card', 'cardForeground',
      'primary', 'primaryForeground', 'secondary', 'secondaryForeground',
      'accent', 'accentForeground', 'muted', 'mutedForeground',
      'border', 'gradientStart', 'gradientMid', 'gradientEnd',
    ];

    VISUAL_THEMES.forEach(theme => {
      requiredColors.forEach(colorKey => {
        expect(theme.colors).toHaveProperty(colorKey);
        expect(typeof (theme.colors as any)[colorKey]).toBe('string');
      });
    });
  });

  it('each theme has name and description', () => {
    VISUAL_THEMES.forEach(theme => {
      expect(theme.name).toBeTruthy();
      expect(theme.description).toBeTruthy();
    });
  });

  it('all colors use oklch format', () => {
    VISUAL_THEMES.forEach(theme => {
      Object.values(theme.colors).forEach(color => {
        expect(color).toMatch(/^oklch\(/);
      });
    });
  });
});

describe('getTheme', () => {
  it('returns cosmic theme', () => {
    expect(getTheme('cosmic')?.id).toBe('cosmic');
  });

  it('returns minimal theme', () => {
    expect(getTheme('minimal')?.id).toBe('minimal');
  });

  it('returns undefined for unknown id', () => {
    expect(getTheme('nonexistent')).toBeUndefined();
  });
});
