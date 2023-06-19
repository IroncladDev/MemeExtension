import { css, SerializedStyles } from "@emotion/react";

/**
 * This is a helper that constructs a Record of serialized CSS styling - a
 * mapping from IDs to SerializedStyles. This makes it easier to create
 * type-safe objects that contain a set of CSS styles following our recent
 * convention to pull emotion styles out of components, which we do to optimize
 * Emotion performance according to their recommended best practices:
 *  https://emotion.sh/docs/best-practices#consider-defining-styles-outside-your-components
 *
 * @example
 * const styles = cssRecord({
 *  headerText: { fontWeight: 'bold' },
 *  subheadingText: [rcss.p(4), rcss.color.foregroundDimmer]
 * });
 *
 * function Component() {
 *   return <>
 *    <span css={styles.headerText}>Themes</span>
 *    <span css={styles.subheadingText}>Customize everything</span>
 *   </>
 * }
 */
export function cssRecord<T>(
  input: Record<keyof T, Parameters<typeof css>[0]>
) {
  const serializedStyleObject: Partial<Record<keyof T, SerializedStyles>> = {};
  for (const key in input) {
    serializedStyleObject[key] = css(input[key]);
  }

  return serializedStyleObject as Record<keyof T, SerializedStyles>;
}
