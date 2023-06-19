import fuzzy from "application/lib/fuzzy";
import React from "react";

export interface Match {
  column: number;
  length: number;
}

const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createRenderMatchFunction =
  (style: React.CSSProperties) => (input: string) =>
    <span style={style}>{input}</span>;

const renderResult = (
  elements: Array<React.ReactNode>,
  style: React.CSSProperties
) => {
  const res = elements.map((el, index) => (
    <React.Fragment key={index}>{el}</React.Fragment>
  ));

  return <span style={style}>{res}</span>;
};

export const ArrowIcon = (props: { flipped?: boolean; color: string }) => (
  <svg
    width="28"
    height="14"
    viewBox="0 0 28 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform={props.flipped ? "rotate(180, 14, 7)" : undefined}>
      <path d="M14 14L0 0H28L14 14Z" fill={props.color} opacity={0.6} />
    </g>
  </svg>
);

export const FuzzyMatchSubString = ({
  source,
  match,
  matchStyle = {
    fontWeight: 500,
    color: "var(--foreground-default)",
  },
  style = { color: "var(--foreground-dimmest)" },
}: {
  source: string;
  match: string;
  style?: React.CSSProperties;
  matchStyle?: React.CSSProperties;
}) => {
  const matchRenderer = createRenderMatchFunction(matchStyle);

  const element = fuzzy
    .filter(match, [source], { matchRenderer })
    .map((res) => res.elements);

  if (!element.length) {
    return <>{source}</>;
  }

  return renderResult(element[0], style);
};

export const ExactMatchSubString = ({
  source,
  match,
}: {
  source: string;
  match: string;
}) => {
  if (!source.toLowerCase().includes(match.toLowerCase())) {
    return <>{source}</>;
  }

  const [start, end] = source.split(
    new RegExp(`${escapeRegExp(match)}(.+)?`, "i")
  );

  return (
    <>
      {[
        start,
        <b key={match}>{source.substr(start.length, match.length)}</b>,
        end,
      ]}
    </>
  );
};

export const HighlightMatches = ({
  source,
  matches,
  matchStyle = {
    fontWeight: 500,
    color: "var(--foreground-default)",
  },
  style = {
    color: "var(--foreground-dimmest)",
    maxWidth: "100%",
    wordWrap: "break-word",
  },
}: {
  source: string;
  matches: Array<Match>;
  matchStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}) => {
  let lastIndex = 0;
  const children: Array<React.ReactNode> = [];

  const matchRenderer = createRenderMatchFunction(matchStyle);

  matches.forEach(({ column, length }) => {
    children.push(source.slice(lastIndex, column));
    children.push(matchRenderer(source.slice(column, column + length)));
    lastIndex = column + length;
  });

  children.push(source.slice(lastIndex));

  return renderResult(children, style);
};
