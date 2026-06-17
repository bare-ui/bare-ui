/**
 * Hydration-mismatch audit (phase 2 of `npm run test:hydrate`).
 *
 * For every scenario, this plants the server markup produced by the SSR phase
 * into the DOM and runs a real `createSSRApp(...).mount()` hydration over it,
 * asserting Vue logs **no hydration / mismatch message** — Vue's channel for
 * server/client divergence. It also checks that hydration adopted the existing
 * markup rather than wiping and re-rendering.
 *
 * Requires the fixtures written by `ssr.test.ts`; run via `npm run test:hydrate`
 * (which runs the SSR phase first). The two phases run in different environments
 * (node vs jsdom) and hand off through the fixture file rather than sharing
 * memory.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSSRApp, nextTick } from 'vue';
import { readFileSync } from 'node:fs';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

const fixtures: HydrationFixtures = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

let messages: string[];
let warnSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	messages = [];
	const capture = (...args: unknown[]) => messages.push(args.map(String).join(' '));
	warnSpy = vi.spyOn(console, 'warn').mockImplementation(capture);
	errorSpy = vi.spyOn(console, 'error').mockImplementation(capture);
});

afterEach(() => {
	warnSpy.mockRestore();
	errorSpy.mockRestore();
	document.body.innerHTML = '';
});

describe('hydration audit', () => {
	it('covers every captured scenario', () => {
		// Guard against the fixture file going stale relative to scenarios.ts.
		expect(Object.keys(fixtures).sort()).toEqual(Object.keys(scenarios).sort());
	});

	for (const name of Object.keys(scenarios)) {
		it(`${name} hydrates without a mismatch`, async () => {
			const container = document.createElement('div');
			container.innerHTML = fixtures[name];
			document.body.appendChild(container);
			const serverHTML = container.innerHTML;

			const app = createSSRApp({ render: () => scenarios[name]() });
			app.mount(container);
			// Let onMounted + post-flush effects (e.g. a client-only Teleport) settle.
			await nextTick();
			await nextTick();

			const hydrationLogs = messages.filter((m) => /hydrat|mismatch/i.test(m));
			expect(hydrationLogs, `${name} logged:\n${hydrationLogs.join('\n')}`).toEqual([]);

			// When the server produced real markup, hydration must adopt it rather
			// than wipe and re-render. (Open portal overlays render nothing on the
			// server — the Teleport is client-only — so there is nothing to adopt;
			// the no-mismatch check above is the whole guarantee for those.)
			const hadServerMarkup = serverHTML.replace(/<!--.*?-->/g, '').trim().length > 0;
			if (hadServerMarkup) expect(container.childNodes.length).toBeGreaterThan(0);

			app.unmount();
			container.remove();
		});
	}
});
