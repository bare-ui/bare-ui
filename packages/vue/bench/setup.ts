/**
 * Benchmark setup: silence noisy dev warnings from competitor libraries.
 *
 * Vitest loads modules in a jsdom environment. Radix Vue and Headless UI emit
 * Vue dev warnings about missing inject providers and out-of-order lifecycle
 * hooks that are harmless in a benchmark harness but would drown the output.
 * Pass everything else through unchanged.
 */
const SILENCED = [
	'injection "Symbol(',          // radix-vue: missing provider injections
	'[Vue warn]: Component emitted', // headlessui: stray emit warnings
];

function filtered(original: (...args: unknown[]) => void) {
	return (...args: unknown[]) => {
		const first = args[0];
		if (typeof first === 'string' && SILENCED.some((m) => first.includes(m))) return;
		original(...args);
	};
}

console.warn = filtered(console.warn.bind(console));
console.error = filtered(console.error.bind(console));
