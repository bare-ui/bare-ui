/**
 * SSR smoke test + hydration-fixture producer.
 *
 * Runs under `vitest.ssr.config.ts` (`environment: 'node'`, no DOM) and renders
 * each scenario with `@vue/server-renderer`. It proves two things and writes the
 * fixtures the hydration audit replays:
 *
 *   1. Importing the barrel and server-rendering never touches the DOM — there is
 *      no module-level browser access (a violation throws on import or render in
 *      this no-DOM node run).
 *   2. The server markup is deterministic: rendering the same tree twice is
 *      byte-identical, so no random ids or wall-clock values leak into the HTML
 *      and break hydration.
 *
 * After the assertions it writes each scenario's server markup to a fixture file
 * for `hydrate.test.ts` to replay through a real hydration cycle.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Input } from '@/components';
import { scenarios } from './scenarios';
import { FIXTURES_PATH, type HydrationFixtures } from './hydration-fixtures';

const render = (factory: () => ReturnType<typeof h>) =>
	renderToString(createSSRApp({ render: () => factory() }));

const fixtures: HydrationFixtures = {};

describe('SSR', () => {
	for (const [name, scenario] of Object.entries(scenarios)) {
		it(`${name} renders deterministically on the server`, async () => {
			const first = await render(scenario);
			const second = await render(scenario);
			expect(typeof first).toBe('string');
			// Vue resets its `useId` counter per `createSSRApp`, so two fresh renders
			// must be byte-identical — any difference means clock/random leakage.
			expect(first).toBe(second);
			fixtures[name] = first;
		});
	}

	it('generates unique ids within a single render', async () => {
		// Two Input instances in one render must get distinct ids; a collision would
		// break the `for`/`id` association across both fields.
		const html = await renderToString(
			createSSRApp({
				render: () =>
					h('div', null, [
						h(Input.Root, null, {
							default: () => [h(Input.Label, null, { default: () => 'A' }), h(Input.Field)],
						}),
						h(Input.Root, null, {
							default: () => [h(Input.Label, null, { default: () => 'B' }), h(Input.Field)],
						}),
					]),
			}),
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
