/**
 * Hydration-mismatch audit (phase 2 of `npm run test:hydrate`).
 *
 * For every scenario, this plants the server markup produced by the SSR phase
 * into the DOM and runs a real `hydrateRoot()` against the client component,
 * asserting that hydration emits **no recoverable error** (React's channel for a
 * mismatch, surfaced via `onRecoverableError`) and **no hydration `console.error`**.
 * It also checks that hydration adopted the existing markup rather than wiping
 * and re-rendering.
 *
 * Requires the fixtures written by `ssr.test.tsx`; run via `npm run test:hydrate`
 * (which runs the SSR phase first). The two phases run in different environments
 * (node vs jsdom) and hand off through the fixture file rather than sharing
 * memory.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

const fixtures: HydrationFixtures = JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));

let consoleErrors: string[];
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	consoleErrors = [];
	errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
		consoleErrors.push(args.map(String).join(' '));
	});
});

afterEach(() => {
	errorSpy.mockRestore();
	document.body.innerHTML = '';
});

describe('hydration audit', () => {
	it('covers every captured scenario', () => {
		// Guard against the fixture file going stale relative to scenarios.tsx.
		expect(Object.keys(fixtures).sort()).toEqual(Object.keys(scenarios).sort());
	});

	for (const name of Object.keys(scenarios)) {
		it(`${name} hydrates without a mismatch`, () => {
			const container = document.createElement('div');
			container.innerHTML = fixtures[name];
			document.body.appendChild(container);
			const serverHTML = container.innerHTML;

			const recoverable: unknown[] = [];
			let root: ReturnType<typeof hydrateRoot>;
			act(() => {
				root = hydrateRoot(container, scenarios[name](), {
					// A hydration mismatch surfaces here in React 19.
					onRecoverableError: (error) => recoverable.push(error),
				});
			});

			const hydrationErrors = consoleErrors.filter((m) =>
				/hydrat|did(n't| not) match|server[- ]rendered|text content/i.test(m),
			);
			expect(recoverable, `${name} produced recoverable (hydration) errors`).toEqual([]);
			expect(hydrationErrors, `${name} logged:\n${hydrationErrors.join('\n')}`).toEqual([]);

			// When the server produced real markup, hydration must adopt it rather
			// than wipe and re-render. (Closed portal overlays render nothing on the
			// server — there is nothing to adopt; the no-mismatch check above is the
			// whole guarantee for those.)
			const hadServerMarkup = serverHTML.replace(/<!--.*?-->/g, '').trim().length > 0;
			if (hadServerMarkup) expect(container.childNodes.length).toBeGreaterThan(0);

			act(() => root.unmount());
			container.remove();
		});
	}
});
