import { css } from "@emotion/react";
import * as React from "react";
import { rcss } from "application/themes";

const style = css(
  rcss.backgroundColor("outlineDimmest"),
  rcss.height(1),
  rcss.minHeight(1),
  rcss.width("100%")
);

export function DividerH({ className }: { className?: string }) {
  return <div className={className} css={style} />;
}
