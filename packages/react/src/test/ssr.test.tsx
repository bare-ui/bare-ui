/**
 * SSR smoke test + hydration-fixture producer.
 *
 * Runs under `vitest.ssr.config.ts` (`environment: 'node'`, no DOM) and renders
 * each scenario with `react-dom/server`. It proves two things and writes the
 * fixtures the hydration audit replays:
 *
 *   1. Importing the barrel and server-rendering never touches the DOM — there is
 *      no module-level browser access (a violation throws on import or render in
 *      this no-DOM node run).
 *   2. The server markup is deterministic: rendering the same tree twice is
 *      byte-identical, so no random ids or wall-clock values leak into the HTML
 *      and break hydration. React's `useId` is position-based, so a stable tree
 *      yields stable ids across renders.
 *
 * After the assertions it writes each scenario's server markup to a fixture file
 * for `hydrate.test.tsx` to replay through a real `hydrateRoot()` cycle.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { renderToString } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Input } from '@/components';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

const fixtures: HydrationFixtures = {};

describe('SSR', () => {
	for (const [name, scenario] of Object.entries(scenarios)) {
		it(`${name} renders deterministically on the server`, () => {
			const first = renderToString(scenario());
			const second = renderToString(scenario());
			expect(typeof first).toBe('string');
			expect(first).toBe(second);
			fixtures[name] = first;
		});
	}

	it('generates unique ids within a single render', () => {
		// Two Input instances in one render must get distinct ids; a collision would
		// break the `for`/`id` association across both fields.
		const html = renderToString(
			<>
				<Input.Root>
					<Input.Label>A</Input.Label>
					<Input.Field />
				</Input.Root>
				<Input.Root>
					<Input.Label>B</Input.Label>
					<Input.Field />
				</Input.Root>
			</>,
		);
		const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
		expect(ids.length).toBeGreaterThanOrEqual(2);
		expect(new Set(ids).size).toBe(ids.length); // all unique, no collisions
	});

	afterAll(() => {
		mkdirSync(dirname(FIXTURES_PATH), { recursive: true });
		writeFileSync(FIXTURES_PATH, JSON.stringify(fixtures, null, 2));
	});
});
