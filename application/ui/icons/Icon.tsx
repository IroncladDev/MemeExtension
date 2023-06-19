import React from "react";

export type IconSize = 6 | 12 | 16 | 20 | 24 | 32 | 48 | 96;

// Icon Props
export interface Props extends React.SVGAttributes<SVGElement> {
  /** The size of the icon. Small, medium, or large dependent on the icon size map. */
  size?: IconSize;

  /** Primary color for the entire icon */
  color?: string;

  /** Rotate the svg using any valid transform "rotate" value */
  rotate?: number;

  /**
   * use like `img alt` attribute.
   * leave empty `alt=""` if this is purely decorative.
   * if the icon implies some state that's not exposed as visible text or label,
   * provide it such as `<WarningIcon alt="warning" />`
   *  */
  alt?: string;

  /**
   * SVG viewBox
   */
  viewBox?: string;
}

export default function Icon({
  size = 16,
  rotate = 0,
  color = "currentColor",
  style,
  children,
  alt,
  viewBox,
  ...rest
}: Props) {
  return (
    <svg
      preserveAspectRatio="xMidYMin"
      width={size}
      height={size}
      viewBox={viewBox ? viewBox : "0 0 24 24"}
      fill={color}
      style={{ ...style, verticalAlign: "middle" }}
      /** stop icons being exposed to screen reader if they're decorative */
      aria-hidden={!alt}
      css={[
        {
          minWidth: size,
          minHeight: size,
        },
        rotate && {
          transform: `rotate(${rotate}deg);`,
        },
      ]}
      {...rest}
    >
      {/* https://css-tricks.com/accessible-svg-icons/ */}
      {alt ? <title>{alt}</title> : null}
      {children}
    </svg>
  );
}
