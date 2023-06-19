import {
  forwardRef,
  AllHTMLAttributes,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ForwardedRef,
  SVGAttributes,
  LiHTMLAttributes,
} from "react";
import { rcss } from "application/themes";

interface SharedProps {
  dataCy?: string;
}

export interface ViewProps<T extends HTMLElement>
  extends AllHTMLAttributes<T>,
    SharedProps {
  tag?: ElementType;
  // ideally this is ForwardedRef<HTMLElement> but it seems like it rejects
  // html subtypes like AnchorElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innerRef?: ForwardedRef<T>;
}

/**
 * View is our base component for all other components. Internally, most
 * RUI components are made up of Views. It provides some css reset and defaults.
 *
 *
 * While this component supports a "tag" attribute, the tag attribute does not infer
 * the type of props because it requires a huge union of JSX.IntrinsicElements which
 * costs us a lot of typing time. Even passing a generic type parameter to View does
 * not work because it will always use `AllHTMLAttributes<T>` instead of for example
 * `AnchorHTMLAttributes<T>`.
 *
 * You can use SpecializedView to get the correct props for a specific tag, or simply
 * use the tag directly and with `rcss.viewStyle`.
 *
 * TODO figure out to make these work with eslint rules for html elements (e.g. jsx-a11y)
 */
export function View<T extends HTMLElement>({
  tag: TagElt = "div",
  innerRef,
  dataCy,
  ...props
}: ViewProps<T>): JSX.Element {
  return (
    <TagElt ref={innerRef} css={rcss.viewStyle} data-cy={dataCy} {...props} />
  );
}

interface AnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    SharedProps {}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    SharedProps {}

interface DivProps extends HTMLAttributes<HTMLDivElement>, SharedProps {}

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    SharedProps {}

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement>, SharedProps {}

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    SharedProps {}

interface LiProps extends LiHTMLAttributes<HTMLLIElement>, SharedProps {}

interface NavProps extends HTMLAttributes<HTMLElement>, SharedProps {}

interface OlProps extends HTMLAttributes<HTMLOListElement>, SharedProps {}

interface PProps extends HTMLAttributes<HTMLParagraphElement>, SharedProps {}

interface SpanProps extends HTMLAttributes<HTMLSpanElement>, SharedProps {}

interface SvgProps extends SVGAttributes<SVGElement>, SharedProps {}

interface UlProps extends HTMLAttributes<HTMLUListElement>, SharedProps {}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    SharedProps {}

interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement>,
    SharedProps {}

interface FormProps extends HTMLAttributes<HTMLFormElement>, SharedProps {}

/**
 * SpecializedView are Views that are specialized for a specific tag.
 * They are used to provide specific types for refs and props.
 * In most cases you should use the RUI specific components instead of
 * using these directly.
 *
 * TODO figure out to make these work with eslint rules for html elements (e.g. jsx-a11y)
 */
export const SpecializedView = {
  a: forwardRef<HTMLAnchorElement, AnchorProps>(({ dataCy, ...props }, ref) => {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
    );
  }),
  button: forwardRef<HTMLButtonElement, ButtonProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        <button ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  div: forwardRef<HTMLDivElement, DivProps>(({ dataCy, ...props }, ref) => {
    return <div ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  h1: forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h1 ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  h2: forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h2 ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  h3: forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h3 ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  img: forwardRef<HTMLImageElement, ImgProps>(({ dataCy, ...props }, ref) => {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
      <img ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
    );
  }),
  label: forwardRef<HTMLLabelElement, LabelProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  li: forwardRef<HTMLLIElement, LiProps>(({ dataCy, ...props }, ref) => {
    return <li ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  nav: forwardRef<HTMLDivElement, NavProps>(({ dataCy, ...props }, ref) => {
    return <nav ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  ol: forwardRef<HTMLOListElement, OlProps>(({ dataCy, ...props }, ref) => {
    return <ol ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  p: forwardRef<HTMLParagraphElement, PProps>(({ dataCy, ...props }, ref) => {
    return <p ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  span: forwardRef<HTMLSpanElement, SpanProps>(({ dataCy, ...props }, ref) => {
    return <span ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  svg: forwardRef<SVGSVGElement, SvgProps>(({ dataCy, ...props }, ref) => {
    return <svg ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  ul: forwardRef<HTMLUListElement, UlProps>(({ dataCy, ...props }, ref) => {
    return <ul ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />;
  }),
  input: forwardRef<HTMLInputElement, InputProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        <input ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  textarea: forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ dataCy, ...props }, ref) => {
      return (
        <textarea ref={ref} css={rcss.viewStyle} data-cy={dataCy} {...props} />
      );
    }
  ),
  form: forwardRef<HTMLFormElement, FormProps>((props, ref) => {
    return (
      <form ref={ref} css={rcss.viewStyle} data-cy={props.dataCy} {...props} />
    );
  }),
} as const;
