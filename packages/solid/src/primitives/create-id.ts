import { createUniqueId } from 'solid-js';

/**
 * Returns a stable, SSR-safe unique id with an optional human-readable prefix.
 *
 * Pass `staticId` to opt out — useful when the parent already provides an id and you
 * want to honor it instead of generating one.
 *
 * @example
 * const labelId = createId('label')
 * const ownId = createId(undefined, props.id)
 */
export function createId(prefix?: string, staticId?: string): string {
	const generated = createUniqueId();
	if (staticId) return staticId;
	return prefix ? `${prefix}-${generated}` : `wire-${generated}`;
}
