import { View, rcss, Text, tokens } from "application/rui";
import LoadingIcon from "application/ui/icons/Loading";

export function Loading() {
  return (
    <View css={[rcss.flex.column, rcss.center, rcss.flex.grow(1)]}>
      <View
        css={[
          rcss.flex.column,
          rcss.colWithGap(16),
          rcss.center,
          rcss.align.center,
          {
            maxWidth: 300,
          },
        ]}
      >
        <Text variant="subheadBig">Loading</Text>

        <LoadingIcon size={48} color={tokens.foregroundDimmer} />
      </View>
    </View>
  );
}
