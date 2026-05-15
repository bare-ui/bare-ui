import { createMediaQuery } from './create-media-query';
import type { Accessor } from 'solid-js';

/**
 * Returns a reactive accessor that is `true` when the user has requested reduced motion at the OS level.
 *
 * Use to gate animations and transitions for accessibility.
 *
 * @example
 * const reduceMotion = createReduceMotion()
 * const duration = () => reduceMotion() ? 0 : 200
 */
export function createReduceMotion(): Accessor<boolean> {
	return createMediaQuery('(prefers-reduced-motion: reduce)');
}
