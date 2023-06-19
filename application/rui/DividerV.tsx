import { css } from "@emotion/react";
import { tokens } from "application/themes";

const style = css({
  backgroundColor: tokens.outlineDimmest,
  width: 1,
});

export function DividerV({ className }: { className?: string }) {
  return <div className={className} css={style} />;
}
