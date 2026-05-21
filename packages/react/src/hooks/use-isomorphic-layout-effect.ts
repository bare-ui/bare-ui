import { useEffect, useLayoutEffect } from 'react';

/**
 * Resolves to `useLayoutEffect` on the client and `useEffect` on the server.
 *
 * Use anywhere `useLayoutEffect` is appropriate but the component may also render
 * during SSR — avoids React's "useLayoutEffect does nothing on the server" warning
 * without changing client behaviour.
 *
 * @example
 * useIsomorphicLayoutEffect(() => {
 *   // measure DOM synchronously after commit
 * }, [deps])
 */
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;
