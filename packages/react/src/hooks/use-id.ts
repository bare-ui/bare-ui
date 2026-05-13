import { useId as useReactId } from 'react';

/**
 * Returns a stable, SSR-safe unique id with an optional human-readable prefix.
 *
 * Pass `staticId` to opt out — useful when the parent already provides an id and you
 * want to honor it instead of generating one.
 *
 * @example
 * const labelId = useId('label')
 * const ownId = useId(undefined, props.id)
 */
export function useId(prefix?: string, staticId?: string): string {
	const generated = useReactId();
	if (staticId) return staticId;
	const cleaned = generated.replace(/:/g, '');
	return prefix ? `${prefix}-${cleaned}` : `wire-${cleaned}`;
}
