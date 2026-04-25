/**
 * Merges two prop objects together while preserving Solid's reactivity.
 *
 * - For function values (event handlers), both functions are composed so that
 *   both are called when the merged handler fires. The consumer's handler (`a`)
 *   fires first, then the internal one (`b`).
 * - For all other values, `b` takes precedence over `a` (when defined).
 *
 * Returns a Proxy so accesses always read the current value from each source —
 * critical because Solid props are reactive Proxies (via `splitProps` /
 * `props`). A plain spread would snapshot values at component setup time and
 * lose reactivity.
 *
 * Note: this differs from `mergeProps` exported by `solid-js`, which simply
 * lets later sources override earlier — it does *not* compose function
 * handlers. We need composition so that a consumer-provided `onMouseEnter`
 * does not silently replace the internal hover-tracking handler.
 *
 * @example
 * const merged = mergeProps(
 *   { onMouseEnter: () => console.log('consumer') },
 *   { onMouseEnter: () => setIsHovered(true) }
 * );
 * // merged.onMouseEnter() → logs 'consumer', then sets hover state
 */
export function mergeProps<A extends Record<string, unknown>, B extends Record<string, unknown>>(a: A, b: B): A & B {
	return new Proxy({} as A & B, {
		get(_target, key) {
			if (typeof key === 'symbol') return undefined;
			const aVal = (a as Record<string, unknown>)[key];
			const bVal = (b as Record<string, unknown>)[key];

			if (typeof aVal === 'function' && typeof bVal === 'function') {
				return (...args: unknown[]) => {
					(aVal as (...args: unknown[]) => unknown)(...args);
					(bVal as (...args: unknown[]) => unknown)(...args);
				};
			}

			if (bVal !== undefined) return bVal;
			return aVal;
		},
		has(_target, key) {
			if (typeof key === 'symbol') return false;
			return key in (a as object) || key in (b as object);
		},
		ownKeys() {
			return [...new Set([...Object.keys(a), ...Object.keys(b)])];
		},
		getOwnPropertyDescriptor(_target, key) {
			if (typeof key === 'symbol') return undefined;
			const exists = key in (a as object) || key in (b as object);
			if (!exists) return undefined;
			return { enumerable: true, configurable: true };
		},
	});
}
