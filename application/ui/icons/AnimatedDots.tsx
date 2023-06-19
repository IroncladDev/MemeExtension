import React from "react";
import { keyframes } from "@emotion/react";
import Icon, { Props as IconProps } from "./Icon";

const fadeInOut = keyframes`
  0% {
    opacity: 1;
  }
  60%, 100% {
    opacity: 0.2;
  }
`;

/**
 * Renders three dots that fade in and out. Useful as a loading indicator.
 */
export default function AnimatedDots(props: IconProps) {
  return (
    <Icon {...props}>
      <circle
        cx="3"
        cy="12"
        r="3"
        css={{
          animation: `${fadeInOut} 2s infinite`,
          animationDelay: "0s",
        }}
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        css={{
          animation: `${fadeInOut} 2s infinite`,
          animationDelay: "0.6s",
        }}
      />
      <circle
        cx="21"
        cy="12"
        r="3"
        css={{
          animation: `${fadeInOut} 2s infinite`,
          animationDelay: "1.2s",
        }}
      />
    </Icon>
  );
}
