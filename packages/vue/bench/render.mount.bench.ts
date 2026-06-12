/**
 * Client mount benchmark — measures the cost of mounting (and unmounting) each
 * scenario into a real DOM (jsdom) across Wire UI, Radix Vue, and Headless UI.
 * Vue's `createApp().mount()` commits synchronously on first render, so each
 * iteration measures one full mount + teardown. Covers both inline and
 * portal-rendering (Dialog/Tooltip) scenarios.
 *
 * Run: `npm run bench` (all) or `npm run bench -- render.mount`.
 */
import { bench, describe } from 'vitest';
import { inlineScenarios, portalScenarios } from './scenarios';
import { mountOnce, mountable, logSkips } from './harness';

const allScenarios = { ...inlineScenarios, ...portalScenarios };

for (const [name, variants] of Object.entries(allScenarios)) {
	const runnable = mountable(name, variants);
	describe(`Mount · ${name}`, () => {
		for (const { lib, Component } of runnable) {
			bench(lib, () => {
				mountOnce(Component);
			});
		}
	});
}

logSkips('mount');
