/**
 * SSR smoke test + hydration-fixture producer.
 *
 * Runs under `vitest.ssr.config.ts` (node, `generate: 'ssr'`, `solid-js/web`
 * pinned to its server build). It proves two things and produces the fixtures
 * the hydration audit consumes:
 *
 *   1. Importing the barrel and rendering never touches the DOM — there is no
 *      module-level browser access (a violation throws on import or render in
 *      this `environment: 'node'` run).
 *   2. The server markup is deterministic: rendering the same tree twice is
 *      identical (after normalizing Solid's monotonic id counter), so no random
 *      ids or wall-clock values leak into the HTML and break hydration.
 *
 * After the assertions it writes each scenario's server markup to a fixture file
 * for `hydrate.test.tsx` to replay through a real `hydrate()` cycle.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { renderToString } from 'solid-js/web';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Input } from '../index';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

// `createUniqueId()` is a process-global monotonic counter (`cl-<n>`), so two
// back-to-back server renders advance it — that is by design and is NOT a
// hydration hazard (Solid aligns the counter between a server render and *its*
// client hydration). Normalize it away so the equality check isolates the real
// guarantee: no wall-clock or `Math.random()` value reaches the server output.
const normalizeIds = (html: string) => html.replace(/cl-\d+/g, 'cl-N');

const fixtures: HydrationFixtures = {};

describe('SSR', () => {
	for (const [name, scenario] of Object.entries(scenarios)) {
		it(`${name} renders deterministically on the server`, () => {
			const first = renderToString(scenario);
			const second = renderToString(scenario);
			expect(typeof first).toBe('string');
			expect(normalizeIds(first)).toBe(normalizeIds(second));
			// Capture markup for the hydration phase (one fresh render per scenario).
			fixtures[name] = renderToString(scenario);
		});
	}

	it('generates unique ids within a single render', () => {
		// Two Input instances in one render must get distinct ids; if createUniqueId
		// collided, the `for`/`id` association would break across both fields.
		const html = renderToString(() => (
			<>
				<Input.Root>
					<Input.Label>A</Input.Label>
					<Input.Field />
				</Input.Root>
				<Input.Root>
					<Input.Label>B</Input.Label>
					<Input.Field />
				</Input.Root>
			</>
		));
		const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
		expect(ids.length).toBeGreaterThan(0);
		expect(new Set(ids).size).toBe(ids.length);
	});

	afterAll(() => {
		mkdirSync(dirname(FIXTURES_PATH), { recursive: true });
		writeFileSync(FIXTURES_PATH, JSON.stringify(fixtures, null, 2));
	});
});
