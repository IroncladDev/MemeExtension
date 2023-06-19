import React from "react";
import { css } from "@emotion/react";
import { SpecializedView } from "application/rui/View";
import { interactive } from "application/rui/Interactive";
import { rcss, tokens } from "application/themes";
import { useAutosize } from "application/hooks";
import { mergeRefs } from "application/lib/mergeRefs";

export const inputCss = css([
  interactive.filledAndOutlined,
  rcss.px(8),
  rcss.py(4),
  rcss.flex.growAndShrink(1),
  rcss.color("foregroundDefault"),
  {
    outline: "0 none",
    fontSize: tokens.fontSizeDefault,
    lineHeight: "22px",
    fontFamily: tokens.fontFamilyDefault,
    "&::placeholder": [rcss.color("foregroundDimmest")],
    "&:not([disabled])": { cursor: "text" },
  },
]);

export const inputCssAutoSize = css([
  inputCss,
  {
    resize: "none",
  },
]);

interface BaseInputProps<Element extends HTMLInputElement | HTMLTextAreaElement>
  extends React.HTMLProps<Element> {
  /** A passed ID in order to associate with a label */
  id?: string;
  /** The value */
  value?: string;
  /** The name */
  name?: string;
  /** The change handler */
  onChange?: (e: React.ChangeEvent<Element>) => void;
  /** The keydown handler */
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  /** The onFocus handler */
  onFocus?: (e: React.FocusEvent<Element>) => void;
  /** The onBlur handler */
  onBlur?: (e: React.FocusEvent<Element>) => void;
  /** Makes the input look inactive and prevents any interaction with it */
  disabled?: boolean;
  /** Focuses the input when rendered */
  autoFocus?: boolean;
  /** Text that appears when it has no value id set */
  placeholder?: string;
  /** Allows customizing button look via `css` prop */
  className?: string;
  /** A forwarded ref to the element */
  ref?: React.ForwardedRef<Element>;
  /** Allows selection via cypress */
  dataCy?: string;
}

export interface InputProps extends BaseInputProps<HTMLInputElement> {
  /** input type */
  type?: string;
}

const InputView = SpecializedView.input;

/**
 * Use for single line text input. Renders an <input> element
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => (
    <InputView
      // Spreading props to make using with downshift possible. If/when `getInputProps(): any` is
      // changed to `getInputProps(): SomeType` we can explicitly add them here.
      {...props}
      ref={ref}
      css={inputCss}
    />
  )
);

Input.displayName = "Input";

const TextareaView = SpecializedView.textarea;

export interface MultilineInputProps
  extends BaseInputProps<HTMLTextAreaElement> {
  /** Enables automatic resizing */
  autoSize?: boolean;
}

/**
 * Used internally to render an auto-sizing text area
 */
const MultiLineInputAutosize = React.forwardRef<
  HTMLTextAreaElement,
  MultilineInputProps
>((props: MultilineInputProps, forwardedRef) => {
  const { ref: autosizeRef } = useAutosize();

  return (
    <TextareaView
      {...props}
      ref={mergeRefs(forwardedRef, autosizeRef)}
      css={inputCssAutoSize}
    />
  );
});

MultiLineInputAutosize.displayName = "MultiLineInputAutosize";

/**
 * Use for multi-line text input. Renders a <textarea> element
 */
export const MultiLineInput = React.forwardRef<
  HTMLTextAreaElement,
  MultilineInputProps
>(({ autoSize, ...props }: MultilineInputProps, ref) =>
  autoSize ? (
    // Conditional hooks not allowed, returning a new component
    <MultiLineInputAutosize {...props} ref={ref} />
  ) : (
    <TextareaView
      // Spreading props to make using with downshift possible. If/when `getInputProps(): any` is
      // changed to `getInputProps(): SomeType` we can explicitly add them here.
      {...props}
      ref={ref}
      css={inputCss}
    />
  )
);

MultiLineInput.displayName = "MultiLineInput";
