import * as React from "react";

// TODO: Do not import from app/rui/index! For some reason RUI uses this
// component in the Select, so you can end up with cyclical imports that crash
// the app. We need to move this component to RUI.ß
import { rcss, tokens, Surface } from ".";

function MenuComponent({
  children,
  className,
  innerRef,
}: {
  children: React.ReactNode;
  /** Allows customizing button look via `css` prop */
  className?: string;
  innerRef?: React.ForwardedRef<HTMLUListElement>;
}) {
  return (
    <Surface
      className={className}
      tag="ul"
      elevated
      innerRef={innerRef}
      css={[
        {
          zIndex: 999,
          maxHeight: 300,
          position: "absolute" as "absolute",
          overflowY: "auto" as "auto",
          width: "100%",
          left: 0,
          top: tokens.space8,
          border: "1px solid",
          borderColor: tokens.outlineDimmest,
          listStyle: "none",
        },
        rcss.borderRadius(8),
      ]}
    >
      {children}
    </Surface>
  );
}

export const Menu = React.forwardRef<
  HTMLUListElement,
  Omit<React.ComponentProps<typeof MenuComponent>, "innerRef">
>((props, ref) => <MenuComponent innerRef={ref} {...props} />);
