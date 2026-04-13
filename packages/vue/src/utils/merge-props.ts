/**
 * Merges two prop objects together.
 *
 * - For function values (event handlers), both functions are composed so that
 *   both are called when the merged handler fires. The consumer's handler fires
 *   first, then the internal one.
 * - For all other values, `b` takes precedence over `a`.
 */
export function mergeProps<A extends Record<string, unknown>, B extends Record<string, unknown>>(a: A, b: B): A & B {
	const result = { ...a } as Record<string, unknown>;

	for (const key in b) {
		const aVal = a[key];
		const bVal = b[key];

		if (typeof aVal === 'function' && typeof bVal === 'function') {
			result[key] = (...args: unknown[]) => {
				aVal(...args);
				bVal(...args);
			};
		} else if (bVal !== undefined) {
			result[key] = bVal;
		}
	}

	return result as A & B;
}
