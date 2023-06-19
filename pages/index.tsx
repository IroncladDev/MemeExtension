import MemeEditor from "application/meme";
import { View, rcss } from "application/rui";
import { global } from "application/state";
import Templates from "application/templates";
import { useAtom } from "jotai";

export default function Homepage() {
  const [meme] = useAtom(global.meme);

  return (
    <View css={[rcss.flex.grow(1), rcss.flex.column]}>
      {meme ? <MemeEditor /> : <Templates />}
    </View>
  );
}
