/**
 * SSR render benchmark — measures `renderToString` throughput for each
 * scenario across Wire UI, Radix Vue, and Headless UI. Deterministic and
 * CI-friendly: no layout, no portals, pure server render.
 *
 * `renderToString` is async (Promise-based), so each bench callback is async.
 * Variants that fail the smoke-test are silently dropped (reported by logSkips).
 *
 * Run: `npm run bench` (all) or `npm run bench -- render.ssr`.
 */
import { bench, describe } from 'vitest';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { inlineScenarios } from './scenarios';
import { ssrRenderable, logSkips } from './harness';

for (const [name, variants] of Object.entries(inlineScenarios)) {
	const runnable = await ssrRenderable(name, variants);
	describe(`SSR · ${name}`, () => {
		for (const { lib, Component } of runnable) {
			bench(lib, async () => {
				await renderToString(createSSRApp(Component));
			});
		}
	});
}

logSkips('ssr');
