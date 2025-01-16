import type { Preset } from "unocss";
import type { Theme } from "unocss/preset-mini";

import deepMerge from "deepmerge";
import { generateCSSVars, generateGlobalStyles } from "./generate";
import { themes } from "./themes";
import type { ConfigTheme, PresetNextUIOptions } from "./types";
import { semanticColors, commonColors } from "./colors";
import { animations } from "./animations";
import { utilities } from "./utilities";
import { darkLayout, defaultLayout, lightLayout } from "./default-layout";
import others from "./others";
import resolveConfig from "./resolveConfig";
import { omit } from "lodash-es";
import { isBaseTheme } from "./utils/theme";

export const builtinColors = themes.map((theme) => theme.name);
export const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const;
export const DEFAULT_TRANSITION_DURATION = "250ms";

/**
 * @param globals Generates global variables, like *.border-color, body.color, body.background.
 * @default true
 */
export function presetNextUI(
  options?: PresetNextUIOptions,
  globals = true,
): Preset<Theme> {
  const {
    prefix = "nextui",
    defaultTheme = "light",
    themes: themeObject = {},
    defaultExtendTheme = "light",
    layout: userLayout,
    addCommonColors = false,
  } = options || {};

  const userLightColors = themeObject?.light?.colors || {};
  const userDarkColors = themeObject?.dark?.colors || {};

  const defaultLayoutObj =
    userLayout && typeof userLayout === "object"
      ? deepMerge(defaultLayout, userLayout)
      : defaultLayout;

  const baseLayouts = {
    light: {
      ...defaultLayoutObj,
      ...lightLayout,
    },
    dark: {
      ...defaultLayoutObj,
      ...darkLayout,
    },
  };

  // get other themes from the config different from light and dark
  let otherThemes = omit(themeObject, ["light", "dark"]) || {};

  Object.entries(otherThemes).forEach(
    ([themeName, { extend, colors, layout }]) => {
      const baseTheme =
        extend && isBaseTheme(extend) ? extend : defaultExtendTheme;

      if (colors && typeof colors === "object") {
        otherThemes[themeName].colors = deepMerge(
          semanticColors[baseTheme],
          colors,
        );
      }
      if (layout && typeof layout === "object") {
        otherThemes[themeName].layout = deepMerge(
          extend ? baseLayouts[extend] : defaultLayoutObj,
          layout,
        );
      }
    },
  );

  const light: ConfigTheme = {
    layout: deepMerge(baseLayouts.light, themeObject?.light?.layout || {}),
    colors: deepMerge(semanticColors.light, userLightColors),
  };

  const dark = {
    layout: deepMerge(baseLayouts.dark, themeObject?.dark?.layout || {}),
    colors: deepMerge(semanticColors.dark, userDarkColors),
  };

  const themes = {
    light,
    dark,
    ...otherThemes,
  };

  const resolved = resolveConfig(themes, defaultTheme, prefix);
  console.log("🚀 ~ resolved:", resolved?.colors);

  const createStripeGradient = (stripeColor: string, backgroundColor: string) =>
    `linear-gradient(45deg,  hsl(var(--${prefix}-${stripeColor})) 25%,  hsl(var(--${prefix}-${backgroundColor})) 25%,  hsl(var(--${prefix}-${backgroundColor})) 50%,  hsl(var(--${prefix}-${stripeColor})) 50%,  hsl(var(--${prefix}-${stripeColor})) 75%,  hsl(var(--${prefix}-${backgroundColor})) 75%,  hsl(var(--${prefix}-${backgroundColor})))`;

  const bgImage = {
    "stripe-gradient-default": createStripeGradient(
      "default-200",
      "default-400",
    ),
    "stripe-gradient-primary": createStripeGradient("primary-200", "primary"),
    "stripe-gradient-secondary": createStripeGradient(
      "secondary-200",
      "secondary",
    ),
    "stripe-gradient-success": createStripeGradient("success-200", "success"),
    "stripe-gradient-warning": createStripeGradient("warning-200", "warning"),
    "stripe-gradient-danger": createStripeGradient("danger-200", "danger"),
  };

  return {
    name: "unocss-preset-nextui",
    preflights: [
      {
        getCSS: () => `
        

        `,
      },
    ],
    rules: [
      ...Object.keys(utilities).map((key) => [
        key.substring(1),
        utilities[key] as any,
      ]),
    ],
    theme: {
      colors: {
        ...(addCommonColors ? commonColors : {}),
        ...resolved?.colors,
      },
      scale: {
        "80": "0.8",
        "85": "0.85",
      },
      fontSize: {
        tiny: [
          `var(--${prefix}-font-size-tiny)`,
          `var(--${prefix}-line-height-tiny)`,
        ],
        small: [
          `var(--${prefix}-font-size-small)`,
          `var(--${prefix}-line-height-small)`,
        ],
        medium: [
          `var(--${prefix}-font-size-medium)`,
          `var(--${prefix}-line-height-medium)`,
        ],
        large: [
          `var(--${prefix}-font-size-large)`,
          `var(--${prefix}-line-height-large)`,
        ],
      },
      borderRadius: {
        small: `var(--${prefix}-radius-small)`,
        medium: `var(--${prefix}-radius-medium)`,
        large: `var(--${prefix}-radius-large)`,
      },
      opacity: {
        hover: `var(--${prefix}-hover-opacity)`,
        disabled: `var(--${prefix}-disabled-opacity)`,
      },
      borderWidth: {
        small: `var(--${prefix}-border-width-small)`,
        medium: `var(--${prefix}-border-width-medium)`,
        large: `var(--${prefix}-border-width-large)`,
        1: "1px",
        1.5: "1.5px",
        3: "3px",
        5: "5px",
      },
      boxShadow: {
        small: `var(--${prefix}-box-shadow-small)`,
        medium: `var(--${prefix}-box-shadow-medium)`,
        large: `var(--${prefix}-box-shadow-large)`,
      },
      backgroundSize: {
        "stripe-size": "1.25rem 1.25rem",
      },
      backgroundImage: bgImage,
      transitionDuration: {
        0: "0ms",
        250: "250ms",
        400: "400ms",
        DEFAULT: DEFAULT_TRANSITION_DURATION,
      },
      transitionTimingFunction: {
        "soft-spring": "cubic-bezier(0.155, 1.105, 0.295, 1.12)",
      },
      ...defaultLayout,
      ...lightLayout,
      ...animations,
      ...others,
    },
  };
}

export default presetNextUI;
