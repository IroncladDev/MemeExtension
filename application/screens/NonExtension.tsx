import { View, rcss, Text, tokens } from "application/rui";
import { Puzzle } from "application/ui/icons";

export function NonExtension() {
  return (
    <View css={[rcss.flex.column, rcss.center, rcss.flex.grow(1)]}>
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
        <Text variant="subheadBig">Failed to Connect</Text>

        <Puzzle size={48} color={tokens.foregroundDimmer} />

        <Text
          color="dimmer"
          multiline
          css={{ textAlign: "center" as "center" }}
        >
          The handshake between Replit and this extension couldn't be
          established. Please install this Repl as an extension.
        </Text>
      </View>
    </View>
  );
}
