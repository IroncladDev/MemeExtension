import React from "react";
import { css, keyframes } from "@emotion/react";
import { Props as IconProps } from "./Icon";
import LoaderIcon from "./Loader";

const rotation = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(359deg)" },
});

const rotate = css({
  animation: `${rotation} 1s linear infinite`,
});

export default function LoadingIcon(props: IconProps) {
  return <LoaderIcon {...props} css={rotate} />;
}
