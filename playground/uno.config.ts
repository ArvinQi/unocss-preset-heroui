import { defineConfig, presetIcons, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import presetHeroui from 'unocss-preset-heroui'
console.log('🚀🚀🚀🚀🚀🚀 ~ file: uno.config.ts:23 ~ presetHeroui({defaultTheme: :', presetHeroui({defaultTheme: 'light'}));

const files = [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  '../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
]
export default defineConfig({
  content: {
    filesystem: files,
    pipeline: {
      include: files,
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.3,
    }),
    presetAnimations(),
    presetHeroui({defaultTheme: 'light'}),
  ],
})
