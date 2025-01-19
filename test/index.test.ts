import { describe, it, expect } from 'vitest'
import presetHeroui from '../src/index'
import { defaultLayout, lightLayout, darkLayout } from '../src/default-layout'

describe('presetHeroui', () => {
  it('should return default preset with no options', () => {
    const preset = presetHeroui()
    expect(preset.name).toBe('heroui')
    expect(preset.theme.colors).toHaveProperty('primary')
    expect(preset.theme).toHaveProperty('spacing')
  })

  it('should merge user light theme colors', () => {
    const userColors = { primary: '#ff0000' }
    const preset = presetHeroui({ themes: { light: { colors: userColors } } })
    expect(preset.theme.colors.primary).toBe('hsl(var(--heroui-primary) / var(--heroui-primary-opacity, 1))')
    expect(preset.preflights[0].getCSS()).toContain('--heroui-primary: 0 100% 50%;')
  })

  it('should merge user dark theme colors', () => {
    const userColors = { primary: '#00ff00' }
    const preset = presetHeroui({ themes: { dark: { colors: userColors } } })
    expect(preset.theme.colors.primary).toBe('hsl(var(--heroui-primary) / var(--heroui-primary-opacity, 1))')
    expect(preset.preflights[0].getCSS()).toContain('--heroui-primary: 120 100% 50%;')
  })

  it('should merge user layout', () => {
    const userLayout = { container: { padding: '20px' } }
    const preset = presetHeroui({ layout: userLayout })
    expect(preset.theme.container.padding).toBe('20px')
  })

  it('should handle custom themes', () => {
    const customTheme = {
      custom: {
        extend: 'light',
        colors: { secondary: '#0000ff' },
        layout: { header: { height: '60px' } },
      },
    }
    const preset = presetHeroui({ themes: customTheme })
    expect(preset.theme.colors.secondary).toBe('hsl(var(--heroui-secondary) / var(--heroui-secondary-opacity, 1))')
    expect(preset.preflights[0].getCSS()).toContain('--heroui-secondary: 240 100% 50%;')
    expect(preset.theme.header.height).toBe('60px')
  })
})
