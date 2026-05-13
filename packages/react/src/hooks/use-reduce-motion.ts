import { useMediaQuery } from './use-media-query';

/**
 * Returns `true` when the user has requested reduced motion at the OS level.
 *
 * Use to gate animations and transitions for accessibility.
 *
 * @example
 * const reduceMotion = useReduceMotion()
 * const duration = reduceMotion ? 0 : 200
 */
export function useReduceMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}
