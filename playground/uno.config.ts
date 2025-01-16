import { defineConfig, presetIcons, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { builtinColors, presetShadcn } from 'unocss-preset-shadcn'
const files = [
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@nextui-org/theme/dist/components/(button|tooltip|listbox|select|navbar|popover|form|checkbox|input).js",
];
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
    presetShadcn(builtinColors.map(c => ({ color: c }))),
  ],
})
