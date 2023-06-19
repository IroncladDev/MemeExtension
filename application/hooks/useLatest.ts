import type { MutableRefObject } from "react";
import { useRef } from "react";
import { useIsomorphicLayoutEffect } from ".";

/**
 * access a callback or other changing value
 * without unnecessary re-renders, while also avoiding the
 * performance issues of explicitly memoizing.
 *
 * this implementation and usage is very similar to the React.useEvent RFC "example" implementation
 * https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md#internal-implementation
 *
 * uses `useLayoutEffect` to make sure the ref is updated before effects.
 * see https://kentcdodds.com/blog/useeffect-vs-uselayouteffect#one-special-case
 *
 */
export function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
