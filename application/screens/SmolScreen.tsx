import { minAllowedHeight, minAllowedWidth } from "application/lib/constants";
import { View, rcss, tokens, Text } from "application/rui";
import LayoutIcon from "application/ui/icons/Layout";
import { global } from "application/state";
import { useAtom } from "jotai";

export function SmolScreen() {
  const [windowWidth] = useAtom(global.windowWidth);
  const [windowHeight] = useAtom(global.windowHeight);

  const smallHorizontal = windowWidth < minAllowedWidth;
  const smallVertical = windowHeight < minAllowedHeight;

  const isSmallBoth = smallHorizontal && smallVertical;

  return smallHorizontal || smallVertical ? (
    <View
      css={[
        rcss.flex.column,
        rcss.flex.grow(1),
        rcss.center,
        rcss.backgroundColor("backgroundDefault"),
        rcss.position.fixed,
        {
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
        },
      ]}
    >
      <View
        css={[
          rcss.flex.column,
          rcss.colWithGap(16),
          rcss.center,
          {
            maxWidth: 300,
          },
        ]}
      >
        <Text variant="subheadBig">Window Too Small</Text>

        <LayoutIcon size={48} color={tokens.foregroundDimmer} />

        <Text
          color="dimmer"
          multiline
          css={{ textAlign: "center" as "center" }}
        >
          Your screen is too{" "}
          {isSmallBoth ? "small" : smallHorizontal ? "thin" : "short"}, please
          expand it
          {isSmallBoth ? "" : smallHorizontal ? " horizontally" : " vertically"}
          .
        </Text>
      </View>
    </View>
  ) : null;
}
