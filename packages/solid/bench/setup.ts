/**
 * Benchmark setup: silence Solid's dev-build reactive-ownership warnings.
 *
 * Vitest forces the `development` export condition, so `solid-js` resolves to
 * its dev build. The mount benchmark synchronously disposes each render, but
 * some competitor primitives (Kobalte/Corvu) schedule deferred work (microtasks,
 * floating-position updates) that runs *after* dispose with no owner, producing
 * a flood of "computations created outside a `createRoot`" warnings. They are
 * harmless here and would otherwise drown the benchmark output, so we drop just
 * those two known messages and pass everything else through.
 */
const SILENCED = ['will never be disposed', 'will never be run'];

function filtered(original: (...args: unknown[]) => void) {
	return (...args: unknown[]) => {
		const first = args[0];
		if (typeof first === 'string' && SILENCED.some((m) => first.includes(m))) return;
		original(...args);
	};
}

console.error = filtered(console.error.bind(console));
console.warn = filtered(console.warn.bind(console));
