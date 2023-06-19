import * as React from "react";
import { css } from "@emotion/react";
import { View } from ".";
import { interactive } from "./Interactive";
import { rcss, tokens } from ".";
import { Colorway, filledInteractive, filledStatic } from "./Colorway";
import { Props as IconProps } from "application/ui/icons/Icon";

export interface PillProps<T extends HTMLElement = HTMLElement>
  extends React.HTMLAttributes<T> {
  /** Sets the text of the pill */
  text: string;
  /** Allows customizing pill look via `css` prop */
  className?: string;
  /** Customize the color of the pill and hover states to communicate the purpose */
  colorway?: Colorway;
  /** Icon on the left side of the pill */
  iconLeft?: React.ReactElement<IconProps>;
  /** Icon on the right side of the pill */
  iconRight?: React.ReactElement<IconProps>;
}

export const pillStyles = ({
  colorway,
  clickable,
  iconLeft,
  iconRight,
}: Pick<PillProps, "colorway"> & {
  iconLeft: boolean;
  iconRight: boolean;
  clickable: boolean;
}) =>
  css([
    rcss.reset.button,
    rcss.rowWithGap(4),
    rcss.pl(iconLeft ? 4 : 8),
    rcss.pr(iconRight ? 4 : 8),
    rcss.center,
    clickable && interactive.filled,
    colorway && clickable && filledInteractive(colorway),
    colorway && !clickable && filledStatic(colorway),
    rcss.flex.shrink(1),
    {
      borderRadius: tokens.borderRadiusRound,
      height: tokens.space24,
      fontSize: tokens.fontSizeSmall,
      background: "var(--interactive-background)",
    },
  ]);

/**
 * Use an Pill for hashtags, badges, etc.
 */
export function Pill({
  colorway,
  text,
  iconLeft,
  iconRight,
  ...props
}: PillProps) {
  return (
    <View
      {...props}
      css={pillStyles({
        colorway,
        clickable: false,
        iconLeft: !!iconLeft,
        iconRight: !!iconRight,
      })}
    >
      {iconLeft}
      <span>{text}</span>
      {iconRight}
    </View>
  );
}
