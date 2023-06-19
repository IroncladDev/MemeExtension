import React from "react";
import { IconSize } from "./Icon";

// Language Icon Props
export interface Props extends React.SVGAttributes<SVGElement> {
  /** The size of the icon. 12 | 16 | 20 | 24 | 32 | 48 */
  size?: IconSize;
}

export default function LanguageIcon({
  size = 16,
  style,
  children,
  ...rest
}: Props) {
  const newProps = rest.fill ? { fill: rest.fill } : undefined;

  return (
    <svg
      preserveAspectRatio="xMidYMin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ ...style, verticalAlign: "middle" }}
      {...rest}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, newProps);
        }
      })}
      <style jsx>
        {`
          svg {
            min-width: ${size}px;
            min-height: ${size}px;
          }
        `}
      </style>
    </svg>
  );
}
