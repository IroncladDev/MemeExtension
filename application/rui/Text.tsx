import * as React from "react";
import { rcss, tokens } from "application/themes";
import { SpecializedView } from "application/rui/View";
import type { CSSInterpolation } from "@emotion/serialize";
import { cssRecord } from "application/rui/cssRecord";

type Level = 1 | 2 | 3;
export type Variant =
  | "text"
  | "small"
  | "headerBig"
  | "headerDefault"
  | "subheadBig"
  | "subheadDefault";
type Color = "default" | "dimmer" | "dimmest";
type LineHeight = "singleLine" | "default";
type VariantProperties = "fontSize" | "lineHeight" | "fontWeight";
// Extends CSSInterpolation to accept CSS variables for
// narrowly-typed CSS properties, like fontWeight and WebkitLineClamp.
type GeneralizedCSSInterpolation =
  | CSSInterpolation
  | Record<keyof CSSInterpolation, any>;

interface CommonProps extends React.AriaAttributes {
  className?: string;
  color?: Color;
  variant?: Variant;
  /** Uses a fixed-height wrapper to make the element's height single-line */
  height?: LineHeight;
  /** set an id: useful for associating text/header with other elements for a11y */
  id?: string;
  /** Allows selection via cypress */
  dataCy?: string;
  children?: React.ReactNode;
}

export interface TextProps extends CommonProps {
  multiline?: boolean;
  maxLines?: number;
  title?: string;
}

export interface HeaderProps extends CommonProps {
  level: Level;
}

const cssTokens = {
  fontSize: "--fontSize",
  lineHeight: "--lineHeight",
  fontWeight: "--fontWeight",
  color: "--color",
  maxLines: "--maxLines",
};

const cssVars = {
  fontSize: `var(${cssTokens.fontSize})`,
  lineHeight: `var(${cssTokens.lineHeight})`,
  fontWeight: `var(${cssTokens.fontWeight})`,
  color: `var(${cssTokens.color})`,
  maxLines: `var(${cssTokens.maxLines})`,
};

const defaults: GeneralizedCSSInterpolation = {
  display: "inline",
  overflowWrap: "break-word",
  fontSize: cssVars.fontSize,
  lineHeight: cssVars.lineHeight,
  fontWeight: cssVars.fontWeight,
  color: cssVars.color,
};

const lineClamp: GeneralizedCSSInterpolation = {
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: cssVars.maxLines,
  WebkitBoxOrient: "vertical",
};

const style = cssRecord({
  multiLine: defaults,
  multiLineClamped: [defaults, lineClamp],
  singleLine: [defaults, rcss.truncate],
  singleLineWrapper: {
    height: cssVars.fontSize,
    display: "flex",
    alignItems: "center",
  },
});

const variants: Record<
  VariantProperties,
  Record<Variant, undefined | CSSInterpolation>
> = {
  fontSize: {
    text: tokens.fontSizeDefault,
    small: tokens.fontSizeSmall,
    headerBig: tokens.fontSizeHeaderBig,
    headerDefault: tokens.fontSizeHeaderDefault,
    subheadBig: tokens.fontSizeSubheadBig,
    subheadDefault: tokens.fontSizeSubheadDefault,
  },
  lineHeight: {
    text: tokens.lineHeightDefault,
    small: tokens.lineHeightSmall,
    headerBig: tokens.lineHeightHeaderBig,
    headerDefault: tokens.lineHeightHeaderDefault,
    subheadBig: tokens.lineHeightSubheadBig,
    subheadDefault: tokens.lineHeightSubheadDefault,
  },
  fontWeight: {
    text: undefined,
    small: undefined,
    headerBig: tokens.fontWeightMedium,
    headerDefault: tokens.fontWeightMedium,
    subheadBig: tokens.fontWeightMedium,
    subheadDefault: tokens.fontWeightMedium,
  },
};

const colors: Record<Color, undefined | CSSInterpolation> = {
  default: undefined,
  dimmer: tokens.foregroundDimmer,
  dimmest: tokens.foregroundDimmest,
};

const SpanView = SpecializedView.span;

const Text = React.forwardRef<
  HTMLSpanElement,
  React.PropsWithChildren<TextProps>
>(function Text(
  {
    color,
    multiline,
    maxLines,
    variant = "text",
    height = "default",
    children,
    ...rest
  }: TextProps,
  ref
) {
  const styleVal = () => {
    if (!multiline && !maxLines) return style.singleLine;

    if (maxLines) return style.multiLineClamped;

    return style.multiLine;
  };

  const colorToken = color ? { [cssTokens.color]: colors[color] } : null;
  const maxLinesToken = maxLines ? { [cssTokens.maxLines]: maxLines } : null;
  const variantTokens = {
    [cssTokens.fontSize]: variants.fontSize[variant],
    [cssTokens.lineHeight]: variants.lineHeight[variant],
    [cssTokens.fontWeight]: variants.fontWeight[variant],
  };

  const elem = (
    <SpanView
      ref={ref}
      {...rest}
      css={styleVal()}
      style={{ ...variantTokens, ...colorToken, ...maxLinesToken }}
    >
      {children}
    </SpanView>
  );

  if (height === "singleLine")
    return (
      <span
        css={style.singleLineWrapper}
        style={{ [cssTokens.fontSize]: variants.fontSize[variant] }}
      >
        {elem}
      </span>
    );

  return elem;
});

const HeaderViews = {
  1: SpecializedView.h1,
  2: SpecializedView.h2,
  3: SpecializedView.h3,
} as const;

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
  function Header(
    {
      color,
      level,
      variant,
      children,
      ...rest
    }: React.PropsWithChildren<HeaderProps>,
    ref
  ) {
    const Component = HeaderViews[level];

    const variantFallback = variant ? variant : "text";

    const colorToken = color ? { [cssTokens.color]: colors[color] } : null;
    const variantTokens = {
      [cssTokens.fontSize]: variants.fontSize[variantFallback],
      [cssTokens.lineHeight]: variants.lineHeight[variantFallback],
      [cssTokens.fontWeight]: variant
        ? variants.fontWeight[variant]
        : tokens.fontWeightMedium,
    };

    return (
      <Component
        ref={ref}
        css={style.singleLine}
        style={{ ...variantTokens, ...colorToken }}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

export { Header, Text };
