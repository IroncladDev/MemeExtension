import { tokens } from "application/themes";
import { loadingStyle } from "./LoadingStyle";
import { TRANSITIONS } from "application/ui/constants";

export const colormap = {
  primary: {
    dimmest: tokens.accentPrimaryDimmest,
    dimmer: tokens.accentPrimaryDimmer,
    default: tokens.accentPrimaryDefault,
    stronger: tokens.accentPrimaryStronger,
    strongest: tokens.accentPrimaryStrongest,
  },
  positive: {
    dimmest: tokens.accentPositiveDimmest,
    dimmer: tokens.accentPositiveDimmer,
    default: tokens.accentPositiveDefault,
    stronger: tokens.accentPositiveStronger,
    strongest: tokens.accentPositiveStrongest,
  },
  negative: {
    dimmest: tokens.accentNegativeDimmest,
    dimmer: tokens.accentNegativeDimmer,
    default: tokens.accentNegativeDefault,
    stronger: tokens.accentNegativeStronger,
    strongest: tokens.accentNegativeStrongest,
  },
  warning: {
    dimmest: tokens.orangeDimmest,
    dimmer: tokens.orangeDimmer,
    default: tokens.orangeDefault,
    stronger: tokens.orangeStronger,
    strongest: tokens.orangeStrongest,
  },
  red: {
    dimmest: tokens.redDimmest,
    dimmer: tokens.redDimmer,
    default: tokens.redDefault,
    stronger: tokens.redStronger,
    strongest: tokens.redStrongest,
  },
  orange: {
    dimmest: tokens.orangeDimmest,
    dimmer: tokens.orangeDimmer,
    default: tokens.orangeDefault,
    stronger: tokens.orangeStronger,
    strongest: tokens.orangeStrongest,
  },
  yellow: {
    dimmest: tokens.yellowDimmest,
    dimmer: tokens.yellowDimmer,
    default: tokens.yellowDefault,
    stronger: tokens.yellowStronger,
    strongest: tokens.yellowStrongest,
  },
  green: {
    dimmest: tokens.greenDimmest,
    dimmer: tokens.greenDimmer,
    default: tokens.greenDefault,
    stronger: tokens.greenStronger,
    strongest: tokens.greenStrongest,
  },
  teal: {
    dimmest: tokens.tealDimmest,
    dimmer: tokens.tealDimmer,
    default: tokens.tealDefault,
    stronger: tokens.tealStronger,
    strongest: tokens.tealStrongest,
  },
  blue: {
    dimmest: tokens.blueDimmest,
    dimmer: tokens.blueDimmer,
    default: tokens.blueDefault,
    stronger: tokens.blueStronger,
    strongest: tokens.blueStrongest,
  },
  blurple: {
    dimmest: tokens.blurpleDimmest,
    dimmer: tokens.blurpleDimmer,
    default: tokens.blurpleDefault,
    stronger: tokens.blurpleStronger,
    strongest: tokens.blurpleStrongest,
  },
  purple: {
    dimmest: tokens.purpleDimmest,
    dimmer: tokens.purpleDimmer,
    default: tokens.purpleDefault,
    stronger: tokens.purpleStronger,
    strongest: tokens.purpleStrongest,
  },
  magenta: {
    dimmest: tokens.magentaDimmest,
    dimmer: tokens.magentaDimmer,
    default: tokens.magentaDefault,
    stronger: tokens.magentaStronger,
    strongest: tokens.magentaStrongest,
  },
  pink: {
    dimmest: tokens.pinkDimmest,
    dimmer: tokens.pinkDimmer,
    default: tokens.pinkDefault,
    stronger: tokens.pinkStronger,
    strongest: tokens.pinkStrongest,
  },
  grey: {
    dimmest: tokens.greyDimmest,
    dimmer: tokens.greyDimmer,
    default: tokens.greyDefault,
    stronger: tokens.greyStronger,
    strongest: tokens.greyStrongest,
  },
} as const;

export type Colorway = keyof typeof colormap;

export function nofill(colorway: Colorway) {
  const { dimmer, stronger, strongest } = colormap[colorway];

  return {
    transitionProperty: "color, background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderStyle: "solid",
    borderColor: "transparent",
    borderWidth: 1,
    "&": {
      color: stronger,
    },
    ":disabled": {
      color: dimmer,
    },
    ":not([disabled])": {
      ":hover": {
        color: strongest,
        backgroundColor: dimmer,
      },
      ":focus": {
        color: strongest,
        boxShadow: "0 0 0 2px " + strongest,
        ":not(:focus-visible)": {
          // leave color alone, too complex to fully fix just for safari
          boxShadow: "none",
        },
      },
      ":active": {
        transition: "none",
        color: strongest,
        backgroundColor: dimmer,
        borderColor: strongest,
      },
    },
  };
}

export function outlined(colorway: Colorway, loading?: boolean) {
  const {
    dimmest,
    dimmer,
    default: dflt,
    stronger,
    strongest,
  } = colormap[colorway];

  const loadingStyles = loading
    ? loadingStyle.backgroundPulse(dimmest, "transparent")
    : null;

  return {
    transitionProperty: "color, background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderStyle: "solid",
    borderColor: dimmer,
    borderWidth: 1,
    "&": {
      color: stronger,
    },
    ":disabled": {
      color: dimmer,
    },
    ":not([disabled])": {
      "@media (hover: hover)": {
        ":hover": {
          color: strongest,
          borderColor: dflt,
          backgroundColor: dimmer,
        },
      },
      ":focus": {
        color: strongest,
        boxShadow: "0 0 0 2px " + strongest,
        ":not(:focus-visible)": {
          // leave color alone, too complex to fully fix just for safari
          boxShadow: "none",
        },
      },
      ":active": {
        transition: "none",
        color: strongest,
        backgroundColor: dimmest,
        borderColor: strongest,
      },
    },
    ...loadingStyles,
  };
}

export function filledStatic(colorway: Colorway) {
  const { dimmer } = colormap[colorway];

  return {
    transitionProperty: "background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "transparent",
    "&": {
      color: tokens.foregroundDefault,
      backgroundColor: dimmer,
      boxShadow: "none",
    },
  };
}

/**
 * Only use these styles on elements that can be disabled, as otherwise
 * we might find ourselves using the non-disabled state on elements that
 * are not meant to be interactive.
 */
export function filledInteractive(colorway: Colorway, loading?: boolean) {
  const {
    dimmest,
    dimmer,
    default: dflt,
    stronger,
    strongest,
  } = colormap[colorway];

  const loadingStyles = loading
    ? loadingStyle.backgroundPulse(dimmest, dimmer)
    : null;

  return {
    ...filledStatic(colorway),
    ":disabled": {
      backgroundColor: dimmest,
      color: dflt,
    },
    ":not([disabled])": {
      "@media (hover: hover)": {
        ":hover": {
          backgroundColor: dflt,
        },
      },
      ":focus": {
        boxShadow: "0 0 0 2px " + stronger,
        ":not(:focus-visible)": {
          boxShadow: "none",
        },
      },
      ":active": {
        transition: "none",
        backgroundColor: dflt,
        borderColor: strongest,
      },
    },
    ...loadingStyles,
  };
}

export function filledAndOutlined(colorway: Colorway) {
  const {
    dimmest,
    dimmer,
    default: dflt,
    stronger,
    strongest,
  } = colormap[colorway];

  return {
    transitionProperty: "border-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: dimmer,
    "&": {
      color: strongest,
      backgroundColor: dimmest,
      boxShadow: "none",
    },
    ":disabled": {
      backgroundColor: dimmest,
      color: dflt,
    },
    ":not([disabled])": {
      ":hover": {
        borderColor: strongest,
      },
      ":focus": {
        boxShadow: "0 0 0 2px " + stronger,
        ":not(:focus-visible)": {
          boxShadow: "none",
        },
      },
      ":active": {
        transition: "none",
        backgroundColor: dimmer,
        borderColor: dflt,
      },
    },
  };
}
