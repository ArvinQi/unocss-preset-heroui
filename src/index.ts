import deepMerge from 'deepmerge'
import { omit } from 'lodash-es'
import { definePreset } from 'unocss'

import { semanticColors } from './colors'
import { darkLayout, defaultLayout, lightLayout } from './default-layout'
import resolveConfig from './resolveConfig'
import type { ConfigTheme, ConfigThemes, PresetHerouiOptions } from './types'
import { isBaseTheme } from './utils/theme'

export const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const
export const DEFAULT_TRANSITION_DURATION = '250ms'

export default definePreset((options?: PresetHerouiOptions) => {
//   presetHeroui(
//   options?: PresetHerouiOptions,
//   globals = true,
// ): Preset<Theme> {
  const {
    prefix = 'heroui',
    defaultTheme = 'light',
    themes: themeObject = {},
    defaultExtendTheme = 'light',
    layout: userLayout,
    // addCommonColors = false,
  } = options || {}

  const userLightColors = themeObject?.light?.colors || {}
  const userDarkColors = themeObject?.dark?.colors || {}

  const defaultLayoutObj
    = userLayout && typeof userLayout === 'object'
      ? deepMerge(defaultLayout, userLayout)
      : defaultLayout

  const baseLayouts = {
    light: {
      ...defaultLayoutObj,
      ...lightLayout,
    },
    dark: {
      ...defaultLayoutObj,
      ...darkLayout,
    },
  }

  // get other themes from the config different from light and dark
  const otherThemes: ConfigThemes = omit(themeObject, ['light', 'dark']) || {}

  Object.entries(otherThemes).forEach(
    ([themeName, { extend, colors, layout }]) => {
      const baseTheme
        = extend && isBaseTheme(extend) ? extend : defaultExtendTheme

      if (colors && typeof colors === 'object' && otherThemes?.[themeName]?.colors) {
        otherThemes[themeName].colors = deepMerge(
          semanticColors[baseTheme],
          colors,
        )
      }
      if (layout && typeof layout === 'object' && otherThemes?.[themeName]?.layout) {
        otherThemes[themeName].layout = deepMerge(
          extend ? baseLayouts[extend] : defaultLayoutObj,
          layout,
        )
      }
    },
  )

  const light: ConfigTheme = {
    layout: deepMerge(baseLayouts.light, themeObject?.light?.layout || {}),
    colors: deepMerge(semanticColors.light, userLightColors),
  }

  const dark = {
    layout: deepMerge(baseLayouts.dark, themeObject?.dark?.layout || {}),
    colors: deepMerge(semanticColors.dark, userDarkColors),
  }

  const themes = {
    light,
    dark,
    ...otherThemes,
  }

  const resolved = resolveConfig(themes, defaultTheme, prefix)

  return {
    name: 'heroui',
    preflights: [{
      getCSS: () => `
          ${Object.keys(resolved?.utilities ?? {})?.map(key => `
              ${key} {
                ${Object.keys(resolved?.utilities[key] ?? {})?.map(k => `
                  ${k}: ${resolved?.utilities?.[key]?.[k] ?? ''};
                  `).join('')}
              }
            `).join('')}
      `,
    }],
    theme: {
      colors: resolved?.colors,
      ...resolved?.layout,
    },
    rules: [
      ...(resolved?.rules || []),
      // Add your custom rules here
    ],
    // variants: resolved?.variants,
  }
})
