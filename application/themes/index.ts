import { globalTokens } from "./globals";
import { colorNames } from "./keys";

export { tokenNames, colorNames } from "./keys";
export type { ColorName, TokenName, CssVarName } from "./keys";

export { globalTokens };
export { media, rcss, ModalZIndex, selectors, truncate } from "./tokens";

const colorTokens: { [p: string]: string } = Object.keys(colorNames).reduce(
  (acc, key) => ({
    ...acc,
    [key]: `var(${colorNames[key as keyof typeof colorNames]})`,
  }),
  {}
);

export const tokens: { [k: string]: string } = {
  ...globalTokens,
  ...colorTokens,
};
