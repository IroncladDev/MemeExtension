/**
 * merge many refs to pass to one element.
 *
 * vendored via:
 * https://github.com/gregberge/react-merge-refs/blob/main/src/index.tsx
 */
export function mergeRefs<T = unknown>(
  ...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
