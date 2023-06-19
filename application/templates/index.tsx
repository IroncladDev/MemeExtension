import {
  View,
  rcss,
  tokens,
  Button,
  Text,
  Input,
  interactive,
} from "application/rui";
import { global } from "application/state";
import ChevronDoubleLeft from "application/ui/icons/ChevronDoubleLeft";
import ChevronLeft from "application/ui/icons/ChevronLeft";
import ChevronRight from "application/ui/icons/ChevronRight";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function Meme({ title, imageUrl }: { title: string; imageUrl: string }) {
  const [, setMeme] = useAtom(global.meme);

  return (
    <View
      css={[
        rcss.flex.column,
        rcss.align.center,
        rcss.borderRadius(8),
        rcss.border({ color: "backgroundHigher" }),
        rcss.maxWidth(240),
        interactive.outlined,
      ]}
      onClick={() => {
        setMeme({
          title,
          imageUrl,
        });
      }}
    >
      <View css={[rcss.p(8)]}>
        <Text variant="subheadDefault" multiline css={rcss.textAlign.center}>
          {title}
        </Text>
      </View>
      <View
        css={[
          rcss.minWidth(200),
          rcss.width("100%"),
          rcss.minHeight(200),
          rcss.borderRadius(0, 0, 8, 8),
          rcss.border({
            direction: "top",
            color: "backgroundHigher",
          }),
          {
            backgroundColor: tokens.backgroundRoot,
            backgroundSize: "contain",
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          },
        ]}
      ></View>
    </View>
  );
}

export default function Templates() {
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [memes, setMemes] = useState<
    Array<{
      title: string;
      imageUrl: string;
    }>
  >([]);
  const [nextPage, setHasNextPage] = useState(true);
  const [prevPage, setHasPrevPage] = useState(false);

  const fetchMemes = () => {
    setLoading(true);
    const args: Array<string> = [
      query ? `query=${query}` : "",
      page > 1 ? `page=${String(page)}` : "",
    ];

    fetch(
      `https://memeapi.replit.app/memes?${args
        .filter((x) => x.length > 0)
        .join("&")}`
    )
      .then((res) => res.json())
      .then(
        ({
          memes: memeItems,
          hasNextPage,
          hasPreviousPage,
        }: {
          memes: Array<{
            title: string;
            imageUrl: string;
          }>;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        }) => {
          setMemes(memeItems);
          setHasNextPage(hasNextPage);
          setHasPrevPage(hasPreviousPage);
          setLoading(false);
        }
      );
  };

  useEffect(() => {
    fetchMemes();
  }, [query, page]);

  return (
    <View css={[rcss.flex.column]}>
      <View
        css={[
          rcss.flex.column,
          rcss.colWithGap(8),
          rcss.p(8),
          rcss.border({
            direction: "bottom",
            color: "backgroundHigher",
          }),
        ]}
      >
        <View css={[rcss.flex.row, rcss.rowWithGap(8), rcss.align.center]}>
          <Text variant="subheadDefault">Meme Generator</Text>

          <View css={rcss.flex.grow(1)} />

          <View css={[rcss.flex.row, rcss.rowWithGap(8)]}>
            <Button
              text="First"
              iconLeft={<ChevronDoubleLeft />}
              onClick={() => setPage(1)}
              disabled={loading || page === 1}
            />
            <Button
              text="Prev"
              iconLeft={<ChevronLeft />}
              disabled={!prevPage || loading}
              onClick={() => setPage(page - 1)}
            />
            <Button
              text="Next"
              iconRight={<ChevronRight />}
              disabled={!nextPage || loading}
              onClick={() => setPage(page + 1)}
            />
          </View>
        </View>

        <View css={[rcss.flex.row, rcss.rowWithGap(8)]}>
          <Input
            placeholder="Enter to Search"
            css={rcss.flex.grow(1)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorway="primary" text="Search" />
        </View>
      </View>

      <View
        css={[
          rcss.flex.row,
          rcss.p(8),
          rcss.justify.center,
          {
            flexWrap: "wrap" as "wrap",
            gap: 8,
          },
        ]}
      >
        {memes.map(({ title, imageUrl }, i) => (
          <Meme key={i} title={title} imageUrl={imageUrl} />
        ))}
      </View>

      <View css={[rcss.flex.row, rcss.rowWithGap(8)]}>
        <Button
          text="First"
          iconLeft={<ChevronDoubleLeft />}
          onClick={() => setPage(1)}
          disabled={loading || page === 1}
        />
        <Button
          text="Prev"
          iconLeft={<ChevronLeft />}
          disabled={!prevPage || loading}
          onClick={() => setPage(page - 1)}
        />
        <Button
          text="Next"
          iconRight={<ChevronRight />}
          disabled={!nextPage || loading}
          onClick={() => setPage(page + 1)}
        />
      </View>
    </View>
  );
}
