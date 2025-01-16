import Color from "color";
import { omit, kebabCase, mapKeys } from "@nextui-org/shared-utils";
import { flattenThemeObject } from "./utils/object";
import {
  ConfigTheme,
  ConfigThemes,
  DefaultThemeType,
  NextUIPluginConfig,
} from "./types";

const parsedColorsCache: Record<string, number[]> = {};

// @internal
const resolveConfig = (
  themes: ConfigThemes = {},
  defaultTheme: DefaultThemeType,
  prefix: string,
) => {
  const resolved: {
    variants: { name: string; definition: string[] }[];
    utilities: Record<string, Record<string, any>>;
    colors: Record<
      string,
      ({
        opacityValue,
        opacityVariable,
      }: {
        opacityValue: string;
        opacityVariable: string;
      }) => string
    >;
  } = {
    variants: [],
    utilities: {},
    colors: {},
  };

  for (const [themeName, { extend, layout, colors }] of Object.entries(
    themes,
  )) {
    let cssSelector = `.${themeName},[data-theme="${themeName}"]`;
    const scheme =
      themeName === "light" || themeName === "dark" ? themeName : extend;

    // if the theme is the default theme, add the selector to the root element
    if (themeName === defaultTheme) {
      cssSelector = `:root,${cssSelector}`;
    }

    resolved.utilities[cssSelector] = scheme
      ? {
          "color-scheme": scheme,
        }
      : {};

    // flatten color definitions
    const flatColors = flattenThemeObject(colors) as Record<string, string>;

    const flatLayout = layout
      ? mapKeys(layout, (_, key) => kebabCase(key))
      : {};

    // resolved.variants
    resolved.variants.push({
      name: themeName,
      definition: [`&.${themeName}`, `&[data-theme='${themeName}']`],
    });

    /**
     * Colors
     */
    for (const [colorName, colorValue] of Object.entries(flatColors)) {
      if (!colorValue) return;

      try {
        const parsedColor =
          parsedColorsCache[colorValue] ||
          Color(colorValue).hsl().round(2).array();

        parsedColorsCache[colorValue] = parsedColor;

        const [h, s, l, defaultAlphaValue] = parsedColor;
        const nextuiColorVariable = `--${prefix}-${colorName}`;
        const nextuiOpacityVariable = `--${prefix}-${colorName}-opacity`;

        // set the css variable in "@layer utilities"
        resolved.utilities[cssSelector]![
          nextuiColorVariable
        ] = `${h} ${s}% ${l}%`;
        // if an alpha value was provided in the color definition, store it in a css variable
        if (typeof defaultAlphaValue === "number") {
          resolved.utilities[cssSelector]![nextuiOpacityVariable] =
            defaultAlphaValue.toFixed(2);
        }
        // set the dynamic color in tailwind config theme.colors
        resolved.colors[colorName] = ({ opacityVariable, opacityValue }) => {
          // if the opacity is set  with a slash (e.g. bg-primary/90), use the provided value
          if (!isNaN(+opacityValue)) {
            return `hsl(var(${nextuiColorVariable}) / ${opacityValue})`;
          }
          // if no opacityValue was provided (=it is not parsable to a number)
          // the nextuiOpacityVariable (opacity defined in the color definition rgb(0, 0, 0, 0.5)) should have the priority
          // over the tw class based opacity(e.g. "bg-opacity-90")
          // This is how tailwind behaves as for v3.2.4
          if (opacityVariable) {
            return `hsl(var(${nextuiColorVariable}) / var(${nextuiOpacityVariable}, var(${opacityVariable})))`;
          }

          return `hsl(var(${nextuiColorVariable}) / var(${nextuiOpacityVariable}, 1))`;
        };
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log("error", error?.message);
      }
    }

    /**
     * Layout
     */
    for (const [key, value] of Object.entries(flatLayout)) {
      if (!value) return;

      const layoutVariablePrefix = `--${prefix}-${key}`;

      if (typeof value === "object") {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          const nestedLayoutVariable = `${layoutVariablePrefix}-${nestedKey}`;

          resolved.utilities[cssSelector]![nestedLayoutVariable] = nestedValue;
        }
      } else {
        // Handle opacity values and other singular layout values
        const formattedValue =
          layoutVariablePrefix.includes("opacity") && typeof value === "number"
            ? value.toString().replace(/^0\./, ".")
            : value;

        resolved.utilities[cssSelector]![layoutVariablePrefix] = formattedValue;
      }
    }
  }

  return resolved;
};
export default resolveConfig;
