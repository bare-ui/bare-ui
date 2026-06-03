/**
 * Client mount benchmark — measures the cost of mounting (and unmounting) each
 * scenario into a real DOM (jsdom) across Wire UI, Radix UI, and Headless UI.
 * `flushSync` forces a synchronous commit so each iteration measures one full
 * mount. Covers both inline and portal-rendering (Dialog/Tooltip) scenarios.
 *
 * Run: `npm run bench` (all) or `npm run bench -- render.mount`.
 */
import { bench, describe } from 'vitest';
import { createElement, type ComponentType } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { inlineScenarios, portalScenarios } from './scenarios';

function mountOnce(Component: ComponentType) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);
	flushSync(() => root.render(createElement(Component)));
	root.unmount();
	container.remove();
}

const allScenarios = { ...inlineScenarios, ...portalScenarios };

for (const [name, variants] of Object.entries(allScenarios)) {
	describe(`Mount · ${name}`, () => {
		for (const { lib, Component } of variants) {
			bench(lib, () => {
				mountOnce(Component);
			});
		}
	});
}
