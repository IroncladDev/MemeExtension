import DOMPurify from "isomorphic-dompurify";
import sanitizeHtml from "sanitize-html";
//@ts-ignore
import { marked } from "marked";
import { useMemo } from "react";

const clean = (dirty: string, allowHeaders?: boolean) =>
  sanitizeHtml(dirty, {
    allowedTags: [
      "i",
      "em",
      "strong",
      "a",
      "p",
      "code",
      "br",
      "br",
      "del",
      "b",
      "blockquote",
      "hr",
      ...(allowHeaders ? ["h1", "h2", "h3", "h4"] : []),
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedIframeHostnames: [],
  });

export const renderMarkdown = (markdown: string, allowHeaders?: boolean) => {
  const dirtyMarkdown = DOMPurify.sanitize(marked.parse(markdown));

  return clean(dirtyMarkdown, allowHeaders);
};

export const Markdown = ({
  markdown,
  allowHeaders,
}: {
  markdown: string;
  allowHeaders?: boolean;
}) => {
  const renderedMarkdown = useMemo(
    () => renderMarkdown(markdown, allowHeaders),
    [markdown]
  );

  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{
        __html: renderedMarkdown,
      }}
    />
  );
};
