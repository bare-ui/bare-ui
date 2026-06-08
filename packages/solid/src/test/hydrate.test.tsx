/**
 * Hydration-mismatch audit (phase 2 of `npm run test:hydrate`).
 *
 * For every scenario, this plants the server markup produced by the SSR phase
 * into the DOM and runs a real Solid `hydrate()` against the client-compiled
 * component, asserting that hydration emits **no `console.error` / `console.warn`**
 * — Solid's channel for hydration mismatches and reactive errors. It also checks
 * that hydration adopted the existing markup rather than wiping and re-rendering.
 *
 * Requires the fixtures written by `ssr.test.tsx`; run via `npm run test:hydrate`
 * (which runs the SSR phase first). The `solid-js/web` server build and the
 * client build compile components for different targets, so the two phases hand
 * off through the fixture file rather than sharing memory.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hydrate } from 'solid-js/web';
import { readFileSync } from 'node:fs';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

const fixtures: HydrationFixtures = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

// Seed Solid's hydration context exactly as `generateHydrationScript()` does in
// the browser, so `hydrate()` finds the runtime it expects.
function seedHydrationContext() {
	(globalThis as unknown as { _$HY: unknown })._$HY = {
		events: [],
		completed: new WeakSet(),
		r: {},
		fe() {},
	};
}

let errorSpy: ReturnType<typeof vi.spyOn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	seedHydrationContext();
	errorSpy = vi.spyOn(console, 'error');
	warnSpy = vi.spyOn(console, 'warn');
});

afterEach(() => {
	errorSpy.mockRestore();
	warnSpy.mockRestore();
	document.body.innerHTML = '';
});

describe('hydration audit', () => {
	it('covers every captured scenario', () => {
		// Guard against the fixture file going stale relative to scenarios.tsx.
		expect(Object.keys(fixtures).sort()).toEqual(Object.keys(scenarios).sort());
	});

	for (const name of Object.keys(scenarios)) {
		it(`${name} hydrates without console errors`, async () => {
			const container = document.createElement('div');
			container.innerHTML = fixtures[name];
			document.body.appendChild(container);
			const serverHTML = container.innerHTML;

			const dispose = hydrate(() => scenarios[name](), container);
			// Let any queued hydration effects/microtasks flush.
			await Promise.resolve();
			await Promise.resolve();

			const calls = [...errorSpy.mock.calls, ...warnSpy.mock.calls].map((args) =>
				args.map((a: unknown) => (typeof a === 'string' ? a : String(a))).join(' '),
			);
			expect(calls, `hydration logged:\n${calls.join('\n')}`).toEqual([]);

			// When the server produced real markup, hydration must adopt it rather
			// than wipe and re-render. (Closed portal-backed overlays legitimately
			// render nothing on the server, so there is nothing to adopt — the
			// no-console-error check above is the whole guarantee for those.)
			const hadServerMarkup = serverHTML.replace(/<!--.*?-->/g, '').trim().length > 0;
			if (hadServerMarkup) expect(container.childNodes.length).toBeGreaterThan(0);

			dispose();
		});
	}
});
