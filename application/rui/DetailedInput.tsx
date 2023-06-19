import { css } from "@emotion/react";
import React from "react";
import { useUIDSeed } from "react-uid";
import { View } from "./View";
import { Input } from "./Input";
import { rcss, tokens } from "application/themes";
import { Text } from "./Text";
import LoadingIcon from "application/ui/icons/Loading";
import CheckIcon from "application/ui/icons/Check";
import ExclamationIcon from "application/ui/icons/Exclamation";
import WarningIcon from "application/ui/icons/Warning";

export type State = "default" | "error" | "warning" | "success" | "loading";

export interface ValidationState {
  message: string;
  state: State;
}

interface FieldState {
  error: { message: string } | null | undefined;
  warning: { message: string } | null | undefined;
  description?: string | null | undefined;
  // TODO: this is ugly
  successText?: string | null | undefined;
  value: string;
  isValid: boolean;
  touched: boolean;
}
function toValidationState(field: FieldState): ValidationState | undefined {
  if (!field.touched && field.description)
    return {
      state: "default",
      message: field.description,
    };

  if (field.error)
    return {
      message: field.error.message,
      state: "error",
    };

  if (field.warning)
    return {
      message: field.warning.message,
      state: "warning",
    };

  if (field.isValid)
    return {
      message: field.successText || "",
      state: "success",
    };

  if (!field.touched) return;

  return {
    message: "",
    state: "loading",
  };
}

const inputStyleMap = {
  success: css({
    ":not([disabled])": {
      borderColor: tokens.accentPositiveStrongest,
    },
  }),
  error: css({
    ":not([disabled])": {
      borderColor: tokens.accentNegativeStrongest,
    },
  }),
  warning: css({
    ":not([disabled])": {
      borderColor: tokens.yellowStrongest,
    },
  }),
  default: undefined,
  loading: undefined,
} as const;
const validationStyleMap = {
  success: css([
    {
      color: tokens.accentPositiveStrongest,
    },
  ]),
  error: css([
    {
      color: tokens.accentNegativeStrongest,
    },
  ]),
  warning: css([
    {
      color: tokens.yellowStrongest,
    },
  ]),

  default: undefined,
  loading: undefined,
} as const;

const validationIconMap = {
  success: <CheckIcon />,
  error: <ExclamationIcon />,
  warning: <WarningIcon />,
  default: undefined,
  loading: <LoadingIcon />,
} as const;

const Validation = (props: ValidationState) => {
  const Icon = validationIconMap[props.state];

  return (
    <View css={[validationStyleMap[props.state], rcss.rowWithGap(4)]}>
      {React.isValidElement(Icon)
        ? React.cloneElement(Icon, {
            // @ts-expect-error TODO: how to get around this?
            size: 12,
          })
        : null}
      <Text variant="small">{props.message}</Text>
    </View>
  );
};

const grid = css`
  display: grid;
  grid-gap: ${tokens.space8};
  grid-template-areas:
    "label . status"
    "input input input"
    "validation validation validation"
    "details details details";
  > .label {
    grid-area: label;
  }
  > .status {
    grid-area: status;
  }
  > .input {
    grid-area: input;
  }
  > .details {
    grid-area: details;
  }
  > .validation {
    grid-area: validation;
  }
`;

export interface DetailedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    FieldState {
  id?: string;
  label: string;
  value: string;
  status: React.ReactNode;
  description?: string;
}
export const DetailedInput = ({
  id: _id,
  label,
  status,
  description,
  "aria-describedby": _describedBy,
  error,
  isValid,
  touched,
  value,
  warning,
  successText,
  ...props
}: DetailedInputProps) => {
  const seed = useUIDSeed();
  const id = _id || seed("input");
  const statusId = status && seed("status");
  const descriptionId = description ? seed("description") : undefined;
  const describedBy = [statusId, descriptionId, _describedBy]
    .filter(Boolean)
    .join(" ");

  const validationState = toValidationState({
    description,
    error,
    isValid,
    touched,
    value,
    warning,
    successText,
  });

  return (
    <div css={grid}>
      <label htmlFor={id} className="label">
        <Text variant="small" color="dimmer">
          {label}
        </Text>
      </label>
      {status ? (
        <Text
          variant="small"
          color="dimmer"
          css={[rcss.textAlign.right]}
          className="status"
        >
          {status}
        </Text>
      ) : null}
      <Input
        id={id}
        className="input"
        value={value}
        css={[inputStyleMap[validationState?.state || "default"]]}
        {...props}
        aria-describedby={describedBy}
        aria-invalid={validationState?.state === "error"}
      />
      <div
        id={descriptionId}
        className="validation"
        css={[validationStyleMap[validationState?.state || "default"]]}
        // enable aria-live if we are not showing a static description
        aria-live={validationState?.state !== "default" ? "polite" : undefined}
      >
        {validationState ? <Validation {...validationState} /> : null}
      </div>
    </div>
  );
};
