import { tokens as globalTokens } from "application/themes";
import { TRANSITIONS } from "application/ui/constants";

export const interactiveTokens = {
  interactiveBackground: "--interactive-background",
  interactiveBackgroundActive: "--interactive-background--active",

  interactiveBorder: "--interactive-border",
  interactiveBorderHover: "--interactive-border--hover",
};

export const interactiveVars = {
  interactiveBackground: `var(${interactiveTokens.interactiveBackground})`,
  interactiveBackgroundActive: `var(${interactiveTokens.interactiveBackgroundActive})`,

  interactiveBorder: `var(${interactiveTokens.interactiveBorder})`,
  interactiveBorderHover: `var(${interactiveTokens.interactiveBorderHover})`,
};

const borderActive = globalTokens.accentPrimaryDefault;

/** focus ring styles. see rcss.focusRing for info */
export const focusRing = {
  ":focus": {
    boxShadow: "0 0 0 2px " + borderActive,
    /* Visible in Windows high-contrast themes */
    outline: "2px solid transparent",
    outlineOffset: "4px",
    ":not(:focus-visible)": {
      outline: "none",
      boxShadow: "none",
    },
  },
} as const;

export const interactive = {
  nofill: {
    transitionProperty: "background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderRadius: globalTokens.borderRadius8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    ":not([disabled])": {
      ...focusRing,
      cursor: "pointer",
      "@media (hover: hover)": {
        ":hover": {
          backgroundColor: interactiveVars.interactiveBackground,
        },
      },
      ":not(textarea):active": {
        backgroundColor: interactiveVars.interactiveBackground,
        borderColor: borderActive,
      },
    },
  },
  filled: {
    transitionProperty: "background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderRadius: globalTokens.borderRadius8,
    backgroundColor: interactiveVars.interactiveBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    ":not([disabled])": {
      ...focusRing,
      cursor: "pointer",
      "@media (hover: hover)": {
        ":hover": {
          backgroundColor: interactiveVars.interactiveBackgroundActive,
        },
      },
      ":active": {
        backgroundColor: interactiveVars.interactiveBackgroundActive,
        borderColor: borderActive,
      },
    },
  },
  outlined: {
    transitionProperty: "background-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderRadius: globalTokens.borderRadius8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: interactiveVars.interactiveBorder,
    ":not([disabled])": {
      ...focusRing,
      cursor: "pointer",
      "@media (hover: hover)": {
        ":hover": {
          backgroundColor: interactiveVars.interactiveBackground,
        },
      },
      ":not(textarea):active": {
        borderColor: borderActive,
      },
    },
  },
  filledAndOutlined: {
    transitionProperty: "border-color, box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderRadius: globalTokens.borderRadius8,
    backgroundColor: interactiveVars.interactiveBackground,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    ":not([disabled])": {
      borderColor: interactiveVars.interactiveBorder,
      ...focusRing,
      cursor: "pointer",
      "@media (hover: hover)": {
        ":hover": {
          borderColor: interactiveVars.interactiveBorderHover,
        },
      },
      ":not(textarea):active": {
        borderColor: borderActive,
        transition: "none",
      },
    },
  },
  listItem: {
    transitionProperty: "box-shadow",
    transitionDuration: TRANSITIONS.duration,
    transitionTimingFunction: TRANSITIONS.timingFunction,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    ":not([disabled])": {
      ...focusRing,
      cursor: "pointer",
      "@media (hover: hover)": {
        ":hover": {
          backgroundColor: interactiveVars.interactiveBackground,
        },
      },
      ":not(textarea):active": {
        backgroundColor: interactiveVars.interactiveBackgroundActive,
        borderColor: borderActive,
      },
    },
  },
} as const;
