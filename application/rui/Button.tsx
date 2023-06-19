import * as React from "react";

import {
  Colorway,
  filledInteractive,
  outlined as colorwayOutlined,
} from "application/rui/Colorway";
import { Props as IconProps } from "application/ui/icons/Icon";
import { interactive } from "application/rui/Interactive";
import { Text } from "application/rui/Text";
import { rcss, tokens } from "application/themes";
import { View, SpecializedView } from "application/rui/View";
import { loadingStyle } from "./LoadingStyle";

export interface BaseProps extends React.AriaAttributes {
  /** ID is useful for associating the button with other elements for a11y */
  id?: string;
  /** You can't pass children to a `<Button>`, but forwardRef tries to permit it unless forbidden.
   *
   * @private
   */
  children?: never;
  /** Sets the text of the button */
  text: string | React.ReactElement;
  /** Sets an additional piece of text in the button */
  secondaryText?: string | React.ReactElement;
  /** Allows customizing button look via `css` prop */
  className?: string;
  /** Pick a pre-defined color and hover state to communicate the purpose */
  colorway?: Colorway;
  /** Makes the button look inactive and prevents any interaction with it */
  disabled?: boolean;
  /** Icon on the left side of the button */
  iconLeft?: React.ReactElement<IconProps>;
  /** Icon on the right side of the button */
  iconRight?: React.ReactElement<IconProps>;
  /** Switches from interactive.filled to interactive.outlined preset */
  outlined?: boolean;
  /** Makes the button smaller */
  small?: boolean;
  /** Makes the button bigger */
  big?: boolean;
  /** Makes the button fill its container */
  stretch?: boolean;
  /** Allows the content to be aligned left/center/right */
  alignment?: "start" | "center" | "end";
  /** Adds a loading style to the button */
  loading?: boolean;
  /** Allows selection of button via cypress */
  dataCy?: string;
}

export interface ButtonProps extends BaseProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  /**
   * Sets the button type.
   * defaults to `button` instead of the browser default of `submit`.
   */
  type?: "button" | "submit" | "reset";
}

const ButtonView = SpecializedView.button;

interface ButtonCssOptions {
  disabled?: boolean;
  outlined?: boolean;
  stretch?: boolean;
  colorway?: Colorway;
  alignment?: "start" | "center" | "end";
  size: number;
  loading?: boolean;
}

/** Generates CSS to properly style a button. */
export function buttonCss({
  disabled,
  outlined,
  stretch,
  colorway,
  alignment,
  size,
  loading,
}: ButtonCssOptions) {
  return [
    rcss.rowWithGap(8),
    rcss.align[alignment ?? "center"],
    rcss.justify[alignment ?? "center"],
    rcss.reset.button,
    disabled || loading ? { color: tokens.foregroundDimmest } : null,
    outlined ? interactive.outlined : interactive.filled,
    rcss.p(8),
    rcss.borderRadius(8),
    stretch && { alignSelf: "stretch" },
    loading ? { ...loadingStyle.backgroundPulse() } : null,
    colorway &&
      (outlined
        ? colorwayOutlined(colorway, loading)
        : filledInteractive(colorway, loading)),
    { height: size + 16 },
  ];
}

// TODO can this be a subset of or main Variant type?
type TextVariant = "text" | "small" | "subheadDefault";

export function getTextVariant({
  small,
  big,
}: Pick<BaseProps, "small" | "big">): TextVariant {
  if (big) return "subheadDefault";

  if (small) return "small";

  return "text";
}

// TODO can this be a subset of or main IconSize type?
type IconSize = 12 | 16 | 20;

export function getIconSize({
  small,
  big,
}: Pick<BaseProps, "small" | "big">): IconSize {
  if (big) return 20;

  if (small) return 12;

  return 16;
}

interface ButtonContentProps
  extends Pick<
    BaseProps,
    "iconLeft" | "iconRight" | "text" | "secondaryText" | "small" | "alignment"
  > {
  iconSize: IconSize;
  variant: TextVariant;
}

export function ButtonContent({
  iconLeft,
  iconRight,
  text,
  secondaryText,
  iconSize,
  variant,
  alignment,
  small,
}: ButtonContentProps) {
  const buttonText = text ? <Text variant={variant}>{text}</Text> : null;

  return (
    <>
      {iconLeft ? (
        <View
          css={[
            rcss.flex.growAndShrink(1),
            rcss.align[alignment ?? "center"],
            rcss.justify[alignment ?? "center"],
            rcss.rowWithGap(small ? 4 : 8),
          ]}
        >
          {React.cloneElement(iconLeft, { size: iconSize })}
          {buttonText}
        </View>
      ) : (
        buttonText
      )}
      {secondaryText && (
        <Text variant={variant} color={"default"}>
          {secondaryText}
        </Text>
      )}
      {iconRight && React.cloneElement(iconRight, { size: iconSize })}
    </>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      colorway,
      disabled,
      iconLeft,
      iconRight,
      outlined,
      small,
      big,
      stretch,
      text,
      secondaryText,
      alignment,
      loading,
      type = "button",
      ...props
    }: ButtonProps,
    ref
  ) => {
    const variant = getTextVariant({ small, big });
    const iconSize = getIconSize({ small, big });

    const eltCss = buttonCss({
      disabled,
      outlined,
      stretch,
      colorway,
      alignment,
      size: iconSize,
      loading,
    });

    return (
      <ButtonView
        type={type}
        ref={ref}
        css={eltCss}
        disabled={disabled || loading}
        {...props}
      >
        <ButtonContent
          text={text}
          secondaryText={secondaryText}
          iconLeft={iconLeft}
          iconRight={iconRight}
          iconSize={iconSize}
          variant={variant}
          alignment={alignment}
        />
      </ButtonView>
    );
  }
);

Button.displayName = "Button";
