import * as React from "react";
import { View, SpecializedView } from "application/rui/View";
import { interactive } from "./Interactive";
import { rcss, tokens } from "application/themes";
import CheckIcon from "application/ui/icons/Check";
import { cssRecord } from "./cssRecord";

export interface CheckboxProps {
  /** A passed ID in order to associate with a label */
  // TODO why is this required
  id: string;
  /** A passed name to associate with the label */
  name?: string;
  /** Checks the input checkbox, element is considered "selected" */
  // TODO make this required property (controlled component)
  checked?: boolean;
  /** Disables input checkbox, the element looks inactive and onChange can't fire */
  disabled?: boolean;
  /** Whether the checkbox is required in a form */
  required?: boolean;
  /** Called when the user clicks, taps or uses keyboard to activate the button */
  // TODO make this emit a boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = cssRecord({
  checkbox: [rcss.justify.center, rcss.align.center, rcss.position.relative],

  input: [
    interactive.filledAndOutlined,
    {
      // allows for custom styling
      // https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
      appearance: "none",
      width: 20,
      height: 20,
      borderRadius: tokens.borderRadius4,
    },
  ],

  checkIcon: [{ position: "absolute", pointerEvents: "none" }],
});

const Input = SpecializedView.input;

/**
 * Use a Checkbox for selectable inputs when selection is optional
 */
// TODO should this take in a label?
export function Checkbox({
  checked,
  onChange,
  required,
  disabled,
  name,
  id,
}: CheckboxProps) {
  return (
    <View css={styles.checkbox}>
      <Input
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        css={styles.input}
        disabled={disabled}
        name={name}
        id={id}
      />
      {checked ? <CheckIcon css={styles.checkIcon} /> : null}
    </View>
  );
}
