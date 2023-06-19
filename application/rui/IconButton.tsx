import * as React from "react";

import type { Placement } from "@popperjs/core";
import { useButton } from "@react-aria/button";
import { useTooltipTrigger } from "@react-aria/tooltip";
import { mergeProps } from "@react-aria/utils";
import type { PressEvent } from "@react-types/shared";

import { mergeRefs } from "application/lib/mergeRefs";
import { colormap, Colorway, nofill } from "application/rui/Colorway";
import { interactive } from "application/rui/Interactive";
import { rcss, tokens } from "application/themes";
import { Tooltip, TooltipDelay } from "application/rui/Tooltip";
import { View, SpecializedView } from "application/rui/View";
import type { IconSize, Props as IconProps } from "application/ui/icons/Icon";
import { css, SerializedStyles } from "@emotion/react";

type IconButtonSize = 18 | 24 | 28 | 32 | 36 | 40;

const IconSizeMap: Record<IconButtonSize, IconSize> = {
  18: 16,
  24: 16,
  28: 20,
  32: 24,
  36: 24,
  40: 24,
};

export interface IconButtonProps {
  /** Optional ID for associating the button with elements for a11y */
  id?: string;
  /** What does this button do, for screen readers and the tooltip? */
  alt: string;
  /** what size should the IconButton be; 24(default), 28, 32, 36, 40 */
  size?: IconButtonSize;
  /** The <Icon> element to wrap into a button */
  children: React.ReactElement<IconProps>;
  /** Allows customizing button look via `css` prop */
  className?: string;
  /** Customize the color of the icon and hover states to communicate the purpose */
  colorway?: Colorway;
  /** Disables html button, the element looks inactive and onClick can't fire */
  disabled?: boolean;
  /** tabIndex of the button in the DOM  */
  tabIndex?: number;
  /** Called when the user clicks, taps or uses keyboard to activate the button */
  onClick?: (event: PressEvent) => void;
  /** Optional additional element after the icon */
  suffix?: false | React.ReactNode;
  /** How many milliseconds to wait before showing the tooltip.
   *
   * See Tooltip.
   */
  tooltipDelay?: TooltipDelay;
  /** Explicitly hide the tooltip - you MUST still specify alt text for screen readers. */
  tooltipHidden?: boolean;
  /** placement for Tooltip */
  tooltipPlacement?: Placement;
  /** Override the tooltip text to show an extended description.
   *
   * The alt prop must still be set to a sensible value.
   */
  tooltipContents?: string | React.ReactNode;
  /** Override the tooltip's z-index.
   *
   * Button makes an effort to set it correctly, but doing so in all
   * cases is almost impossible. See Tooltip's documentation for more
   * information.
   */
  tooltipZIndex?: number;
  /** Sets the button type */
  type?: "button" | "submit" | "reset" | undefined;
  /** ref of the button element. `ref` is the ref of the wrapping view element. */
  innerRef?: React.Ref<HTMLButtonElement>;
  /** Allows selection via cypress */
  dataCy?: string;
}

const ButtonView = SpecializedView.button;

const sizeVars = {
  width: "--width",
  height: "--height",
};

const sizeTokens = {
  width: `var(${sizeVars.width})`,
  height: `var(${sizeVars.height})`,
};

const buttonCss = css([
  rcss.reset.button,
  interactive.listItem,
  rcss.borderRadius(8),
  rcss.center,
  {
    '&:disabled, &[aria-disabled="true"]': { color: tokens.foregroundDimmest },
    width: sizeTokens.width,
    height: sizeTokens.height,
  },
]);

const buttonColorwayCss = new Map<Colorway, SerializedStyles>();
for (const color of Object.keys(colormap)) {
  const c = color as Colorway;
  buttonColorwayCss.set(c, css([buttonCss, nofill(c)]));
}

function IconButtonInner({
  alt,
  children,
  colorway,
  disabled,
  innerRef,
  onClick,
  size = 24,
  triggerProps,
  type,
  suffix,
  ...props
}: {
  innerRef: React.Ref<HTMLButtonElement>;
  triggerProps: ReturnType<typeof useTooltipTrigger>["triggerProps"];
} & Pick<
  IconButtonProps,
  | "id"
  | "alt"
  | "children"
  | "colorway"
  | "disabled"
  | "onClick"
  | "size"
  | "type"
  | "suffix"
>) {
  const tooltipRef = React.useRef<HTMLButtonElement>(null);

  const { buttonProps } = useButton(
    {
      isDisabled: disabled,
      onPress: onClick,
      type,
      "aria-label": alt,
    },
    tooltipRef
  );

  return (
    <ButtonView
      // height and width are set through css variables so any css passed in
      // form the parent has precedence
      style={{ [sizeVars.height]: size + "px", [sizeVars.width]: size + "px" }}
      css={colorway ? buttonColorwayCss.get(colorway) : buttonCss}
      {...mergeProps(
        { ref: mergeRefs(tooltipRef, innerRef) },
        props,
        triggerProps,
        buttonProps
      )}
    >
      {React.cloneElement(children, { size: IconSizeMap[size] })}
      {suffix}
    </ButtonView>
  );
}

/**
 * Use an IconButton when to wrap icons and let users can interact with them.
 * It comes with a hover/active/focus states and a larger tap target. Backed
 * by html <button> under the hood.
 */
export const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  (
    {
      alt,
      tooltipDelay,
      tooltipHidden,
      tooltipPlacement,
      tooltipContents,
      tooltipZIndex,
      innerRef,
      ...props
    }: IconButtonProps,
    viewRef
  ) => (
    <View innerRef={viewRef}>
      <Tooltip
        delay={tooltipDelay}
        isDisabled={tooltipHidden}
        tooltip={tooltipContents ?? alt}
        placement={tooltipPlacement}
        zIndex={tooltipZIndex}
      >
        {
          //@ts-ignore
          (triggerProps, ref: (instance: HTMLButtonElement | null) => void) => {
            return (
              <IconButtonInner
                alt={alt}
                innerRef={mergeRefs(ref, innerRef)}
                triggerProps={triggerProps}
                {...props}
              />
            );
          }
        }
      </Tooltip>
    </View>
  )
);

IconButton.displayName = "IconButton";
