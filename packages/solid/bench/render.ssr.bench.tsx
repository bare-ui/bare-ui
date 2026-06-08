/**
 * SSR render benchmark — measures `renderToString` throughput for each scenario
 * across Wire UI, Kobalte, and Corvu. Deterministic and CI-friendly: no layout,
 * no portals, pure server render.
 *
 * Run: `npm run bench:ssr` (or `npm run bench` for mount + SSR).
 */
import { bench, describe } from 'vitest';
import { renderToString } from 'solid-js/web';
import { inlineScenarios } from './scenarios';
import { ssrRenderable, logSkips } from './harness';

for (const [name, variants] of Object.entries(inlineScenarios)) {
	const runnable = ssrRenderable(name, variants);
	describe(`SSR · ${name}`, () => {
		for (const { lib, Component } of runnable) {
			bench(lib, () => {
				renderToString(() => <Component />);
			});
		}
	});
}

logSkips('ssr');
