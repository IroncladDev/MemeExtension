import { useCallback, useRef, useState, RefCallback, RefObject } from "react";

/** Get an immutable ref with a function to set the value.
 *
 * Useful for integrating react-aria and other dependencies when
 * re-rendering is needed.
 *
 * For example, react-aria wants a React.Ref<HTMLElement>, while
 * react-popper wants an HTMLElement. While the below song and dance
 * could be achieved by inlining the hook, pretty much everything here
 * would be required, including combining the ref so only one element
 * has to be referred to.
 */
export function useRefState<T>(): [RefObject<T>, RefCallback<T>] {
  const [, setValue] = useState<null | T>(null);
  const ref = useRef<null | T>(null);

  const combinedRef = useCallback((next: null | T) => {
    ref.current = next;
    setValue(next);
  }, []);

  return [ref, combinedRef];
}
