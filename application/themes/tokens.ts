import { tokenNames, colorNames, ColorName } from "./keys";
import { css } from "@emotion/react";
import { CSSProperties } from "react";

type TokenName = keyof typeof tokenNames;
const getToken = (token: TokenName | ColorName) =>
  token in tokenNames
    ? `var(${tokenNames[token as TokenName]})`
    : `var(${colorNames[token as ColorName]})`;

interface RcssBorderInput {
  color?: ColorName;
  width?: number;
  style?: CSSProperties["borderLeftStyle"];
  direction?: "full" | "top" | "left" | "bottom" | "right" | "x" | "y";
  theme?: "light" | "dark";
}

export const ModalZIndex = 300000;

export type Space =
  | 0
  | 2
  | 4
  | 8
  | 12
  | 16
  | 24
  | 32
  | 40
  | 48
  | 64
  | 80
  | 128
  | 256;
const toSpace = (space: Space) => `var(--space-${space})`;

export type Shadow = 1 | 2 | 3;
const toShadow = (shadow: Shadow) => `var(--shadow-${shadow})`;

export const truncate = css({
  display: "inline-block",
  lineHeight: 1.2,
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const BREAKPOINTS = {
  mobileMin: 320,
  mobileMax: 480,
  tabletMin: 768,
  tabletMax: 1024,
};

const TRANSITIONS = {
  duration: "120ms",
  timingFunction: "ease-out",
};

export const media = {
  /**
   * Applies styles at this width and above
   */
  min: (bp: number | keyof typeof BREAKPOINTS) => {
    if (typeof bp === "number") return `@media screen and (min-width: ${bp}px)`;

    return `@media screen and (min-width: ${BREAKPOINTS[bp]}px)`;
  },

  /**
   * Applies styles at this width and below
   */
  max: (bp: number | keyof typeof BREAKPOINTS) => {
    if (typeof bp === "number") return `@media screen and (max-width: ${bp}px)`;

    return `@media screen and (max-width: ${BREAKPOINTS[bp]}px)`;
  },

  /**
   * Applies styles within this width range
   */
  range: (
    min: number | keyof typeof BREAKPOINTS,
    max: number | keyof typeof BREAKPOINTS
  ) => {
    const minValue = typeof min === "number" ? min : BREAKPOINTS[min];
    const maxValue = typeof max === "number" ? max : BREAKPOINTS[max];

    return `@media screen and (min-width: ${minValue}px) and (max-width: ${
      maxValue - 1
    }px)`;
  },

  /**
   * Only applies styles where a hover state is possible (i.e. not on mobile/touch surfaces)
   */
  hover: "@media screen and (hover)",
};

type BorderRadius = 0 | 1 | 2 | 4 | 8 | 12 | 16 | "full";
const toBorderRadius = (radius: BorderRadius) => {
  if (radius === "full") return "50%";

  if (radius === 0) return "0";

  return `var(--border-radius-${radius})`;
};

export const selectors = {
  hover: ":hover",

  /**
   * Focus state while tabbing through, not on click
   */
  focusVisible: ":focus-visible",

  /**
   * Only applies styles on click, not while tabbing through
   */
  unseenFocus: ":focus:not(:focus-visible)",

  /**
   * Applies styles to immediate children of this element,
   * but not to descendants further down the tree
   */
  directDescendants: " > *",

  /**
   * Applies styles to all descendants of this element
   */
  allDescendants: " *",
};

export const rcss = {
  /** Padding (same value on all 4 sides) */
  p: (space: Space) => css({ padding: toSpace(space) }),
  /** Horizontal padding (x-axis: left and right) */
  px: (space: Space) =>
    css({ paddingLeft: toSpace(space), paddingRight: toSpace(space) }),
  /** Vertical padding (y-axis: top and bottom) */
  py: (space: Space) =>
    css({ paddingTop: toSpace(space), paddingBottom: toSpace(space) }),
  /** Padding top */
  pt: (space: Space) => css({ paddingTop: toSpace(space) }),
  /** Padding bottom */
  pb: (space: Space) => css({ paddingBottom: toSpace(space) }),
  /** Padding left */
  pl: (space: Space) => css({ paddingLeft: toSpace(space) }),
  /** Padding right */
  pr: (space: Space) => css({ paddingRight: toSpace(space) }),

  shadow: (shadow: Shadow) => css({ boxShadow: toShadow(shadow) }),

  /** Margin (same value on all 4 sides) */
  m: (space: Space) => css({ margin: toSpace(space) }),
  /** Horizontal margin (x-axis: left and right) */
  mx: (space: Space) =>
    css({ marginLeft: toSpace(space), marginRight: toSpace(space) }),
  /** Vertical margin (y-axis: top and bottom) */
  my: (space: Space) =>
    css({ marginTop: toSpace(space), marginBottom: toSpace(space) }),
  /** Margin top */
  mt: (space: Space) => css({ marginTop: toSpace(space) }),
  /** Margin bottom */
  mb: (space: Space) => css({ marginBottom: toSpace(space) }),
  /** Margin left */
  ml: (space: Space) => css({ marginLeft: toSpace(space) }),
  /** Margin right */
  mr: (space: Space) => css({ marginRight: toSpace(space) }),

  position: {
    static: css({ position: "static" }),
    relative: css({ position: "relative" }),
    absolute: css({ position: "absolute" }),
    fixed: css({ position: "fixed" }),
    sticky: css({ position: "sticky" }),
  },

  flex: {
    row: css({ display: "flex", flexDirection: "row" }),
    column: css({ display: "flex", flexDirection: "column" }),
    rowReverse: css({ display: "flex", flexDirection: "row-reverse" }),
    columnReverse: css({ display: "flex", flexDirection: "column-reverse" }),
    /**
     * Makes the element grow (but not shrink) into the available free space of the parent.
     *
     * @param flexGrow The free space will be divided proportionally between children
     * depending on the `flexGrow` value. If you don't know what to put here use 1.
     */
    grow: (flexGrow: number) => css({ flexGrow }),
    /**
     * Makes the element grow and shrink to fill the available free space of the parent
     *
     * @param flex The free space will be divided proportionally between children
     * depending on the `flex` value. If you don't know what to put here use 1.
     */
    growAndShrink: (flex: number) => css({ flexGrow: flex, flexShrink: flex }),

    /**
     * Makes the element shrink when other elements desire the free space of the parent
     *
     * @param flex How much this element scales down proportionally
     * compared to other elements. If you don't know what to put here
     * use 1.
     */
    shrink: (flex: number) => css({ flexShrink: flex }),

    /**
     * Makes the child elements wrap from top to bottom if they run out of room on the flex axis.
     */
    wrap: css({ flexWrap: "wrap" }),

    /**
     * Makes the child elements wrap from bottom to top if they run out of room on the flex axis.
     */
    wrapReverse: css({ flexWrap: "wrap-reverse" }),
  },

  /**
   * Layout utilities for layout grids.
   */
  layout: {
    /**
     * Make a 4-to-12-column responsive layout grid out of the given element
     */
    columns: css({
      display: "grid",
      gridTemplateColumns: "repeat(var(--column-number), minmax(0, 1fr))",
      gap: getToken("space16"),
      gridAutoColumns: "max-content",
    }),

    /**
     * make a child element of an element with rcss.columns, accepts a number from 1 to 12.
     */
    colSpan: (columns: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) => {
      return css({
        gridColumn:
          "span min(" +
          columns +
          ", var(--column-number)) / span min(" +
          columns +
          ", var(--column-number))",
      });
    },
  },

  /**
   * Set the display value.
   */
  display: {
    none: css({ display: "none" }),
    block: css({ display: "block" }),
    inline: css({ display: "inline" }),
    inlineBlock: css({ display: "inline-block" }),
    flex: css({ display: "flex" }),
    inlineFlex: css({ display: "inline-flex" }),
    grid: css({ display: "grid" }),
  },

  /**
   * Set visibility.
   */
  visibility: {
    visible: css({ visibility: "visible" }),
    hidden: css({ visibility: "hidden" }),
  },

  center: css({ alignItems: "center", justifyContent: "center" }),
  /**
   * If flex-direction is column (default on `View`), this controls
   * alignment of all items on the horizontal x-axis. For rows, it controls
   * alignment on vertical y-axis.
   */
  align: {
    start: css({ alignItems: "flex-start" }),
    center: css({ alignItems: "center" }),
    stretch: css({ alignItems: "stretch" }),
    baseline: css({ alignItems: "baseline" }),
    end: css({ alignItems: "flex-end" }),
  },
  /**
   * If flex-direction is column (default on `View`), this controls
   * alignment of all items on the vertical y-axis. For rows, it controls
   * alignment on horizontal x-axis.
   */
  justify: {
    start: css({ justifyContent: "flex-start" }),
    center: css({ justifyContent: "center" }),
    end: css({ justifyContent: "flex-end" }),
    spaceBetween: css({ justifyContent: "space-between" }),
    spaceAround: css({ justifyContent: "space-around" }),
    spaceEvenly: css({ justifyContent: "space-evenly" }),
  },

  /** Hides an element such that only a screen reader can find it. */
  srOnly: css({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  }),

  /**
   * Lays our children in a row with a gap between them by adding
   * margin to the child elements (so it works in Safari, but can
   * potentially break if the children define their own margin).
   */
  rowWithGap: (space: Space) =>
    css({
      flexDirection: "row",
      "& > *": { marginRight: toSpace(space) },
      "& > *:last-child": { marginRight: 0 },
    }),

  /**
   * Lays our children in a column with a gap between them by adding
   * margin to the child elements (so it works in Safari, but can
   * potentially break if the children define their own margin).
   */
  colWithGap: (space: Space) =>
    css({
      flexDirection: "column",
      "& > *": { marginBottom: toSpace(space) },
      "& > *:last-child": { marginBottom: 0 },
    }),

  /**
   * Lays our children in a reverse row with a gap between them by adding
   * margin to the child elements (so it works in Safari, but can
   * potentially break if the children define their own margin).
   */
  rowReverseWithGap: (space: Space) =>
    css({
      flexDirection: "row-reverse",
      "& > *": { marginRight: toSpace(space) },
      "& > *:first-child": { marginRight: 0 },
    }),

  /**
   * Lays our children in a reverse column with a gap between them by adding
   * margin to the child elements (so it works in Safari, but can
   * potentially break if the children define their own margin).
   */
  colReverseWithGap: (space: Space) =>
    css({
      flexDirection: "column-reverse",
      "& > *": { marginBottom: toSpace(space) },
      "& > *:first-child": { marginBottom: 0 },
    }),

  borderRadius: (
    ...radius:
      | [BorderRadius]
      | [BorderRadius, BorderRadius, BorderRadius, BorderRadius]
  ) => {
    return css({
      borderRadius: radius.map(toBorderRadius).join(" "),
    });
  },

  font: {
    default: css({ fontFamily: getToken("fontFamilyDefault") }),
    code: css({ fontFamily: getToken("fontFamilyCode") }),
  },

  fontWeight: {
    normal: css({ fontWeight: getToken("fontWeightRegular") }),
    medium: css({ fontWeight: getToken("fontWeightMedium") }),
    bold: css({ fontWeight: getToken("fontWeightBold") }),
  },

  /**
   * Set the font size.
   */
  fontSize: (fontSize: number | string) => css({ fontSize }),

  textAlign: {
    left: css({ textAlign: "left" }),
    center: css({ textAlign: "center" }),
    right: css({ textAlign: "right" }),
  },

  color: (color: ColorName) => {
    return css({
      color: getToken(color),
    });
  },

  backgroundColor: (color: ColorName) => {
    return css({
      backgroundColor: getToken(color),
    });
  },

  TRANSITIONS,

  fourPointGradient: ({
    topLeft = "#00FFFF",
    topRight = "#FF00FF",
    bottomLeft = "#FFAE42",
    bottomRight = "#FFD580",
    blendMode = "normal",
  }: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
    blendMode?: string;
  }) =>
    css({
      backgroundColor: "black",
      backgroundImage: `radial-gradient(farthest-corner at top left, ${topLeft}, transparent),
    radial-gradient(farthest-corner at top right, ${topRight}, transparent),
    radial-gradient(farthest-corner at bottom left, ${bottomLeft}, transparent),
    radial-gradient(farthest-corner at bottom right, ${bottomRight}, transparent)`,
      backgroundBlendMode: blendMode,
    }),

  borderGradient: (
    startColor: string,
    endColor: string,
    options?: {
      borderWidth?: number;
      startPosition?: "top left" | "top center" | "top right";
    }
  ) => {
    const width = options && options.borderWidth ? options.borderWidth : 1;
    const position =
      options && options.startPosition ? options.startPosition : "top left";

    return css([
      {
        position: "relative",
        border: width + "px solid transparent",
        ":before": {
          content: '""',
          position: "absolute",
          inset: 0,
          margin: width * -1,
          padding: width,
          borderRadius: "inherit",
          background: `radial-gradient(circle at ${position}, ${startColor}, ${endColor})`,
          mask: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        },
      },
    ]);
  },

  backgroundImage: (url: string) =>
    css({
      backgroundImage: `url("${url}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    }),

  /**
   * Sets the cursor.
   */
  cursor: {
    pointer: css({ cursor: "pointer" }),
    default: css({ cursor: "default" }),
    progress: css({ cursor: "progress" }),
    auto: css({ cursor: "auto" }),
  },

  overflow: (overflow: CSSProperties["overflow"]) => css({ overflow }),
  /**
   * Sets the overflow on the X axis.
   */
  overflowX: (overflowX: CSSProperties["overflowX"]) => css({ overflowX }),
  /**
   * Sets the overflow on the Y axis.
   */
  overflowY: (overflowY: CSSProperties["overflowY"]) => css({ overflowY }),

  /**
   * Sets the z-index.
   */
  zIndex: (zIndex: number) => css({ zIndex }),

  top: (top: number | string) => css({ top }),
  bottom: (bottom: number | string) => css({ bottom }),
  left: (left: number | string) => css({ left }),
  right: (right: number | string) => css({ right }),

  width: (width: number | string) => css({ width }),
  height: (height: number | string) => css({ height }),
  maxWidth: (maxWidth: number | string) => css({ maxWidth }),
  maxHeight: (maxHeight: number | string) => css({ maxHeight }),
  minWidth: (minWidth: number | string) => css({ minWidth }),
  minHeight: (minHeight: number | string) => css({ minHeight }),

  coverContainer: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }),

  transition: {
    snappy: css({
      transitionProperty: "all",
      transitionDuration: "120ms",
      transitionTimingFunction: "ease-out",
    }),
    chill: css({
      transitionProperty: "all",
      transitionDuration: "300ms",
      transitionTimingFunction: "ease-in-out",
    }),
  },

  /**
   * applies `:focus` styles.
   * 1. solves for windows high contrast themes via transparent outline
   * 2. solves for safari :focus-visible cross-browser consistency
   *
   * references:
   * 1. https://piccalil.li/quick-tip/use-transparent-borders-and-outlines-to-assist-with-high-contrast-mode/
   * 2. https://github.com/replit/repl-it-web/pull/13059
   */
  focusRing: css({
    ":focus": {
      boxShadow: "0 0 0 2px " + getToken("accentPrimaryDefault"),
      /* Visible in Windows high-contrast themes */
      outline: "2px solid transparent",
      outlineOffset: "4px",
      ":not(:focus-visible)": {
        outline: "none",
        boxShadow: "none",
      },
    },
  }),

  reset: {
    button: css({
      border: "none",
      background: "transparent",
      color: "inherit",
      font: "inherit",
      lineHeight: "normal",
    }),
  },

  scrollbar: {
    hidden: css({
      "&::-webkit-scrollbar": { width: 0 },
      scrollbarWidth: "none",
    }),
    thin: css({
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      scrollbarWidth: "thin",
    }),
  },

  /**
   * Truncates text with an ellipsis
   */
  truncate,

  /**
   * Sane layout defaults for a flex container (used in our base View component)
   */
  viewStyle: css({
    alignItems: "stretch",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    outline: "none",
    minHeight: 0,
    minWidth: 0,
  }),

  /**
   *  Sets a max width and padding for page content
   */
  pageContent: css({
    paddingTop: getToken("space32"),
    paddingBottom: getToken("space32"),
    paddingLeft: getToken("space16"),
    paddingRight: getToken("space16"),
    maxWidth: 1080,
    marginLeft: "auto",
    marginRight: "auto",
    [media.min("tabletMax")]: {
      paddingTop: getToken("space64"),
      paddingBottom: getToken("space64"),
      paddingLeft: getToken("space32"),
      paddingRight: getToken("space32"),
    },
  }),

  /* Sets the border thickness and color of an element */
  border: ({
    color = "outlineDefault",
    width = 1,
    style = "solid",
    direction = "full",
  }: RcssBorderInput) => {
    switch (direction) {
      case "full":
        return css({
          borderColor: getToken(color),
          borderWidth: width,
          borderStyle: style,
        });
      case "bottom":
        return css({
          borderBottomColor: getToken(color),
          borderBottomWidth: width,
          borderBottomStyle: style,
        });
      case "top":
        return css({
          borderTopColor: getToken(color),
          borderTopWidth: width,
          borderTopStyle: style,
        });
      case "left":
        return css({
          borderLeftColor: getToken(color),
          borderLeftWidth: width,
          borderLeftStyle: style,
        });
      case "right":
        return css({
          borderRightColor: getToken(color),
          borderRightWidth: width,
          borderRightStyle: style,
        });
      case "x":
        return css({
          borderRightColor: getToken(color),
          borderRightWidth: width,
          borderRightStyle: style,
          borderLeftColor: getToken(color),
          borderLeftWidth: width,
          borderLeftStyle: style,
        });
      case "y":
        return css({
          borderTopColor: getToken(color),
          borderTopWidth: width,
          borderTopStyle: style,
          borderBottomColor: getToken(color),
          borderBottomWidth: width,
          borderBottomStyle: style,
        });
    }
  },

  noSelect: {
    "-webkit-user-select": "none" /* Safari */,
    "user-select": "none" /* Standard syntax */,
  },
};
