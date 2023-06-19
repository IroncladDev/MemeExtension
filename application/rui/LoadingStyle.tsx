import { tokens as globalTokens } from "application/themes";
import { interactiveVars } from "./Interactive";
import { keyframes, css, SerializedStyles } from "@emotion/react";

const moveGradient = keyframes(`
  0% {background-position-x: 100%}
  100% {background-position-x: 0%}
`);

/** focus ring styles. see rcss.focusRing for info */
export const loadingStyle = {
  backgroundPulse: (
    lowPulse?: string,
    highPulse?: string
  ): SerializedStyles => {
    const lowExists = typeof lowPulse !== "undefined";
    const highExists = typeof highPulse !== "undefined";

    return css({
      background: `linear-gradient(90deg, ${
        lowExists ? lowPulse : globalTokens.outlineDimmest
      }, ${highExists ? highPulse : interactiveVars.interactiveBackground}, ${
        lowExists ? lowPulse : globalTokens.outlineDimmest
      }, ${highExists ? highPulse : interactiveVars.interactiveBackground})`,
      backgroundSize: "300% 100%",
      backgroundPositionX: "0%",
      animation: `${moveGradient} 2s linear infinite`,
    });
  },
  foregroundPulse: (
    lowPulse?: string,
    highPulse?: string
  ): SerializedStyles => {
    const lowExists = typeof lowPulse !== "undefined";
    const highExists = typeof highPulse !== "undefined";

    return css({
      position: "relative",
      overflow: "hidden",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        content: '""',
        opacity: "50%",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        background: `linear-gradient(90deg, ${
          lowExists ? lowPulse : globalTokens.outlineDefault
        }, ${highExists ? highPulse : globalTokens.backgroundRoot}, ${
          lowExists ? lowPulse : globalTokens.outlineDefault
        }, ${highExists ? highPulse : globalTokens.backgroundRoot})`,
        backgroundSize: "300% 100%",
        backgroundPositionX: "0%",
        animation: `${moveGradient} 2s linear infinite`,
      },
    });
  },
} as const;
