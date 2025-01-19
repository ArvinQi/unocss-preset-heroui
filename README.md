# unocss-preset-heroui

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Use [heroui](https://www.heroui.com/)  with [UnoCSS](https://unocss.dev).

1. Based on [hyoban/unocss-preset-shadcn](https://github.com/hyoban/unocss-preset-shadcn)
1. Theme can be easily customized

## Usage

Follow the official guide to set up [heroui/ui](https://ui.heroui.com/docs/installation/vite), [heroui-vue](https://www.heroui-vue.com/docs/installation/vite.html), or [heroui-svelte](https://www.heroui-svelte.com/docs/installation), or [SolidUI](https://www.solid-ui.com/docs/installation/manual). Replace the step to set up Tailwind CSS with [UnoCSS](https://unocss.dev/integrations/vite).

Then install `unocss-preset-heroui` and `unocss-preset-animations`, and update your `unocss.config.ts`:

```bash
ni -D unocss-preset-animations unocss-preset-heroui
```

```ts
// unocss.config.ts
import { defineConfig, presetIcons, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import presetHeroui from 'unocss-preset-heroui'

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
    presetHeroui(),
  ],
})

```

> [!IMPORTANT]
> Do not run `npx heroui-ui@latest init` to initialize your project.

1. `ni lucide-react class-variance-authority clsx tailwind-merge`
   - `ni lucide-vue-next radix-vue class-variance-authority clsx tailwind-merge` for heroui-vue.
   - `ni lucide-svelte tailwind-variants clsx tailwind-merge` for heroui-svelte.
   - `ni tailwindcss-animate class-variance-authority clsx tailwind-merge` for SolidUI.
1. copy `utils.ts` into your project at `src/lib`
1. create `components.json` or `ui.config.json` (for SolidUI) in your project root and modify as needed
1. `npx heroui-ui@latest add button`
   - `npx heroui-vue@latest add button` for heroui-vue.
   - `npx heroui-svelte@latest add button` for heroui-svelte.
   - `npx solidui-cli@latest add button` for SolidUI.

> [!WARNING]
> If you encounter problems adjusting animation property, this may be because [tailwind-animate](https://github.com/jamiebuilds/tailwindcss-animate) has [duplicate rules about animation and transition](https://github.com/jamiebuilds/tailwindcss-animate/pull/46). You can refer to [Migration Guide from Animations Preset for UnoCSS](https://unocss-preset-animations.aelita.me/guide/migration.html) to solve this problem.

## Dynamic Theme

Preview the [demo](https://unocss-preset-heroui.vercel.app).

If you want to use a dynamic theme, you can pass an array of theme objects to `presetHeroui`:

```ts
import { defineConfig, presetUno, UserConfig } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import presetHeroui from 'unocss-preset-heroui'

export default defineConfig({
  presets: [
    presetUno(),
    presetAnimations(),
    presetHeroui({defaultTheme: 'light'}), // this is default
  ],
})
```

Add a theme sync script to your [index.html](./playground/index.html).
To dynamically change the theme, you can create a [theme switch component](./playground/src/components/theme-switch.tsx).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unocss-preset-heroui?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/unocss-preset-heroui
[npm-downloads-src]: https://img.shields.io/npm/dm/unocss-preset-heroui?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/unocss-preset-heroui
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unocss-preset-heroui?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=unocss-preset-heroui
[license-src]: https://img.shields.io/github/license/hyoban/unocss-preset-heroui.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/hyoban/unocss-preset-heroui/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/unocss-preset-heroui
