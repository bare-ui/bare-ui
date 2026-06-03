/**
 * SSR render benchmark — measures `renderToStaticMarkup` throughput for each
 * scenario across Wire UI, Radix UI, and Headless UI. Deterministic and
 * CI-friendly: no layout, no portals, pure server render.
 *
 * Run: `npm run bench` (all) or `npm run bench -- render.ssr`.
 */
import { bench, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { inlineScenarios } from './scenarios';

for (const [name, variants] of Object.entries(inlineScenarios)) {
	describe(`SSR · ${name}`, () => {
		for (const { lib, Component } of variants) {
			bench(lib, () => {
				renderToStaticMarkup(createElement(Component));
			});
		}
	});
}
