import { useState, ReactNode } from "react";
import { css } from "@emotion/react";

import type {
  Placement,
  PositioningStrategy,
  VirtualElement,
} from "@popperjs/core";
import { useTooltip, useTooltipTrigger } from "@react-aria/tooltip";
import { mergeProps } from "@react-aria/utils";
import {
  useTooltipTriggerState,
  TooltipTriggerState,
} from "@react-stately/tooltip";
import type { AriaTooltipProps } from "@react-types/tooltip";
import { usePopper } from "react-popper";
import { Portal } from "@reach/portal";

import { useRefState } from "application/hooks";
import { rcss, tokens, ModalZIndex } from "application/themes";
import { SpecializedView } from "application/rui/View";

/**
 * Generally we should rely on the default delay for tooltips. This delay was
 * chosen so that tooltips would trigger quickly when a user hovers over the
 * target, but would likely not trigger from a user simply moving their mouse
 * over the target (e.g. moving your mouse "through" the save button on the way
 * to some other element in a form).
 *
 * For tooltips attached to help icons or key information, prefer "none" as the
 * delay. For other UI tooltips where a tooltip might be intrusive if it pops up
 * too quickly, prefer "long" delays.
 *
 * For more info, see:
 * https://spectrum.adobe.com/page/tooltip/#Immediate-or-delayed-appearance
 */
export type TooltipDelay = "none" | "default" | "long";

const tooltipDelayMap: Record<TooltipDelay, number> = {
  none: 0,
  default: 250,
  long: 1000,
};

/** Properties used by both Tooltip and TargetedTooltip */
interface CommonProps {
  /** Tooltip content */
  tooltip: ReactNode;
  /** Where the tooltip wants to appear */
  placement?: Placement;
  /** How to get the tooltip into position */
  strategy?: PositioningStrategy;
  /** Hard override the Z index of the tooltip
   *
   * Portaling elements into the document.documentElement breaks
   * accessibility and styling (CSS variables!) in a few ways, so the
   * next-best thing that we can do is set a z-index and try to fix it
   * locally. Due to the weirdness of stacking contexts in browsers,
   * there isn't any single ideal z-index that could just be set-and-forget.
   */
  zIndex?: number;
  /**
   * Override the default border color. This also updates the arrow color to match
   * */
  borderColor?: string;
  /**
   * Override the default background color.
   */
  backgroundColor?: string;
}

export interface TooltipProps extends CommonProps {
  /** Content the tooltip is positioned around */
  children:
    | ReactNode
    | (<T extends HTMLElement = HTMLElement>(
        props: ReturnType<typeof useTooltipTrigger>["triggerProps"],
        ref: React.Ref<T>
      ) => JSX.Element);
  /** Whether the tooltip is open by default (uncontrolled) */
  defaultOpen?: boolean;
  /** Delay before tooltip appears */
  delay?: TooltipDelay;
  /** Whether the tooltip is disabled (independently from the trigger) */
  isDisabled?: boolean;
  /** Whether the tooltip is open (controlled) */
  isOpen?: boolean;
  /** Fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Override default max width with custom value */
  maxWidth?: string | number;
}

interface TargetedProps extends CommonProps {
  /** State of the tooltip. Usually hooked into a trigger with useTooltipTrigger */
  state?: TooltipTriggerState;
  /** Element the tooltip targets, or a virtual element for arbitrary positioning */
  target: null | VirtualElement | HTMLElement;
  /** Accessibility properties as provided by useTooltip */
  tooltipProps: AriaTooltipProps;
  /** Override default max width with custom value */
  maxWidth?: string | number;
}

const tooltipCss = css({
  pointerEvents: "none",
  fontFamily: tokens.fontFamilyDefault,
});

const tooltipContentCss = css([
  {
    border: `1px solid ${tokens.outlineDimmer}`,
    borderRadius: tokens.borderRadius8,
    backgroundColor: tokens.backgroundHighest,
  },
  rcss.p(8),
  rcss.shadow(1),
]);

export const arrowCss = css({
  display: "block",
  pointerEvents: "none",
  "&::after": {
    content: '""',
    display: "block",
    border: `1px solid ${tokens.outlineDimmer}`,
    borderTopLeftRadius: tokens.borderRadius4,
    background: tokens.backgroundHighest,
    width: 12,
    height: 12,
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
  },
  '[data-popper-placement^="top"] > &': {
    bottom: -6,
    "&::after": {
      transform: "rotate(225deg)",
    },
  },
  '[data-popper-placement^="right"] > &': {
    left: -6,
    "&::after": {
      transform: "rotate(315deg)",
    },
  },
  '[data-popper-placement^="bottom"] > &': {
    top: -6,
    "&::after": {
      transform: "rotate(45deg)",
    },
  },
  '[data-popper-placement^="left"] > &': {
    right: -6,
    "&::after": {
      transform: "rotate(135deg)",
    },
  },
});

const SpanView = SpecializedView.span;

/**
 * Use TargetedTooltip when you need a tooltip to appear somewhere
 * outside of your current React tree. For example, you might attach
 * to an element created by a non-React library.
 *
 * You probably want to use Tooltip unless you need that additional
 * behavior.
 *
 * See Tooltip's implementation for usage.
 */
export function TargetedTooltip({
  placement,
  state,
  strategy,
  target: referenceElt,
  tooltip,
  tooltipProps: passedTooltipProps,
  zIndex,
  borderColor,
  backgroundColor,
  maxWidth,
}: TargetedProps): null | JSX.Element {
  const [popperElt, setPopperElt] = useState<null | HTMLElement>(null);
  const [arrowElt, setArrowElt] = useState<null | HTMLElement>(null);
  const { styles, attributes } = usePopper(referenceElt, popperElt, {
    modifiers: [
      { name: "arrow", options: { element: arrowElt, padding: 8 } },
      { name: "offset", options: { offset: [0, 16] } },
    ],
    strategy,
    placement,
  });
  const { tooltipProps } = useTooltip(passedTooltipProps, state);

  if (typeof window === "undefined") return null;

  return (
    <Portal>
      <SpanView
        {...mergeProps(
          {
            ref: setPopperElt,
            style: styles.popper,
            css: [tooltipCss, { zIndex, maxWidth: maxWidth ? maxWidth : 240 }],
          },
          attributes.popper || {},
          tooltipProps
        )}
      >
        <SpanView css={[tooltipContentCss, { borderColor, backgroundColor }]}>
          {tooltip}
        </SpanView>
        <span
          ref={setArrowElt}
          style={styles.arrow}
          css={[
            arrowCss,
            borderColor && {
              "&::after": {
                borderColor,
              },
            },
            backgroundColor && { "&::after": { backgroundColor } },
          ]}
        />
      </SpanView>
    </Portal>
  );
}

/**
 * Tooltip triggered on hover or focus.
 */
export function Tooltip({
  children,
  defaultOpen,
  delay = "default",
  isDisabled,
  isOpen,
  onOpenChange,
  placement,
  strategy,
  tooltip,
  zIndex = ModalZIndex,
  borderColor = tokens.outlineDefault,
  maxWidth,
  backgroundColor,
}: TooltipProps): JSX.Element {
  const [ref, setRef] = useRefState<HTMLElement>();

  const tooltipTriggerOptions = {
    defaultOpen,
    delay: tooltipDelayMap[delay],
    isDisabled,
    isOpen,
    onOpenChange,
  };
  const state = useTooltipTriggerState(tooltipTriggerOptions);
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    tooltipTriggerOptions,
    state,
    ref
  );

  return (
    <>
      {typeof children === "function" ? (
        children(triggerProps, setRef)
      ) : (
        <SpanView {...mergeProps({ ref: setRef }, triggerProps)}>
          {children}
        </SpanView>
      )}
      {state.isOpen ? (
        <TargetedTooltip
          placement={placement}
          state={state}
          strategy={strategy}
          target={ref.current}
          tooltip={tooltip}
          tooltipProps={tooltipProps}
          zIndex={zIndex}
          borderColor={borderColor}
          backgroundColor={backgroundColor}
          maxWidth={maxWidth}
        />
      ) : null}
    </>
  );
}
