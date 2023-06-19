import * as React from "react";
import { cssRecord } from "./cssRecord";
import { interactiveTokens } from "./Interactive";
import { tokens } from "application/themes";
import { View, ViewProps } from "./View";

export type Background = "root" | "default" | "higher" | "highest";

const backgrounds = ["root", "default", "higher", "highest"] as const;

const backgroundColors = {
  root: tokens.backgroundRoot,
  default: tokens.backgroundDefault,
  higher: tokens.backgroundHigher,
  highest: tokens.backgroundHighest,
} as const;

const backgroundSurfaceStyles = cssRecord({
  root: {
    backgroundColor: tokens.backgroundRoot,

    [interactiveTokens.interactiveBackground]: tokens.backgroundDefault,
    [interactiveTokens.interactiveBackgroundActive]: tokens.backgroundHigher,

    [interactiveTokens.interactiveBorder]: tokens.outlineDimmest,
    [interactiveTokens.interactiveBorderHover]: tokens.outlineDefault,
  },

  default: {
    backgroundColor: tokens.backgroundDefault,

    [interactiveTokens.interactiveBackground]: tokens.backgroundHigher,
    [interactiveTokens.interactiveBackgroundActive]: tokens.backgroundHighest,

    [interactiveTokens.interactiveBorder]: tokens.outlineDimmer,
    [interactiveTokens.interactiveBorderHover]: tokens.outlineStronger,
  },

  higher: {
    backgroundColor: tokens.backgroundHigher,

    [interactiveTokens.interactiveBackground]: tokens.backgroundHighest,
    [interactiveTokens.interactiveBackgroundActive]: tokens.backgroundDefault,

    [interactiveTokens.interactiveBorder]: tokens.outlineDefault,
    [interactiveTokens.interactiveBorderHover]: tokens.outlineStrongest,
  },

  highest: {
    backgroundColor: tokens.backgroundHighest,

    [interactiveTokens.interactiveBackground]: tokens.backgroundHigher,
    [interactiveTokens.interactiveBackgroundActive]: tokens.backgroundDefault,

    [interactiveTokens.interactiveBorder]: tokens.outlineStronger,
    [interactiveTokens.interactiveBorderHover]: tokens.outlineStrongest,
  },
});

const Elevation = React.createContext(0);

function elevationToBackground(elevation: number) {
  // clamp elevation to the range of backgrounds we have
  elevation = Math.max(0, Math.min(elevation, backgrounds.length - 1));

  return backgrounds[elevation];
}

function backgroundToElevation(background: Background) {
  const index = backgrounds.indexOf(background);

  if (index === -1) {
    throw new Error(`Invalid background ${background}`);
  }

  return index;
}

export interface SurfaceProps<T extends HTMLElement> extends ViewProps<T> {
  /**
   * Explicitly sets the background color of the surface.
   * If this prop is set, the `elevated` prop will be ignored.
   */
  background?: Background;
  /**
   * If true, the surface will be elevated by one level from the current
   * context. If false, the surface will be at the same level as before.
   *
   * If the `background` prop is set, this prop will be ignored.
   *
   * Defaults to false.
   */
  elevated?: boolean;
}

export function Surface<T extends HTMLElement>({
  elevated,
  background,
  ...props
}: SurfaceProps<T>) {
  let elevation = React.useContext(Elevation);

  // if the background is explicitly set, we'll take the elevation
  // value from that rather than the from the context and the
  // elevated prop, as really these two props are mutually exclusive
  if (background) {
    elevation = backgroundToElevation(background);
  } else if (elevated) {
    elevation++;
  }

  const style = backgroundSurfaceStyles[elevationToBackground(elevation)];

  return (
    <Elevation.Provider value={elevation}>
      <View css={style} {...props} />
    </Elevation.Provider>
  );
}

/**
 * Returns the background color of the surface based on the current context
 */
export function useSurfaceBackgroundColor({
  elevated,
}: { elevated?: boolean } = {}) {
  let elevation = React.useContext(Elevation);

  if (elevated) {
    elevation++;
  }

  return backgroundColors[elevationToBackground(elevation)];
}
