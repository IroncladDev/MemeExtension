import { useEffect, useLayoutEffect } from "react";

/**
 * intelligently switches between useLayoutEffect on the client,
 * and useEffect on the server where useLayoutEffect is not supported.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
