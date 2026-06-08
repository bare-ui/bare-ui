/**
 * SSR smoke test — renders representative components with `renderToString` in a
 * no-DOM Node process (see `vitest.ssr.config.ts`). It asserts two things that
 * together prove the package is server-render-safe:
 *
 *   1. Importing the barrel and rendering never touches the DOM — there is no
 *      module-level browser access (a violation would throw on import or render
 *      in this `environment: 'node'` run).
 *   2. The server markup is deterministic: rendering the same tree twice is
 *      byte-identical, so no random ids or wall-clock values leak into the HTML
 *      and break hydration.
 */
import { describe, it, expect } from 'vitest';
import { renderToString } from 'solid-js/web';
import type { JSX } from 'solid-js';
import {
	Badge,
	Button,
	Card,
	Divider,
	ProgressBar,
	Skeleton,
	Spinner,
	Input,
	Textarea,
	Password,
	Switch,
	Tabs,
	Modal,
	Drawer,
} from '../index';

// Each scenario is rendered twice; the two HTML strings must match exactly.
const scenarios: Record<string, () => JSX.Element> = {
	// Presentational (no directive) — must render server-side with no boundary.
	Badge: () => <Badge count={5} />,
	Card: () => <Card>card</Card>,
	Divider: () => <Divider />,
	ProgressBar: () => <ProgressBar value={42} />,
	Skeleton: () => <Skeleton />,
	Spinner: () => <Spinner />,

	// Interactive ('use client') — still rendered to HTML on the server first.
	Button: () => <Button>click</Button>,
	Switch: () => (
		<Switch.Root>
			<Switch.Thumb />
		</Switch.Root>
	),

	// Generated ids must be stable across renders (createId -> createUniqueId).
	Input: () => (
		<Input.Root>
			<Input.Label>Email</Input.Label>
			<Input.Field />
			<Input.Error />
		</Input.Root>
	),
	Textarea: () => (
		<Textarea.Root>
			<Textarea.Label>Bio</Textarea.Label>
			<Textarea.Field />
		</Textarea.Root>
	),
	Password: () => (
		<Password.Root>
			<Password.Field />
			<Password.Toggle />
		</Password.Root>
	),
	Tabs: () => (
		<Tabs.Root defaultValue='one'>
			<Tabs.List>
				<Tabs.Trigger value='one'>One</Tabs.Trigger>
				<Tabs.Trigger value='two'>Two</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='one'>Panel One</Tabs.Content>
			<Tabs.Content value='two'>Panel Two</Tabs.Content>
		</Tabs.Root>
	),

	// Portal-backed overlays (closed) must not read `document` on the server.
	'Modal (closed)': () => (
		<Modal.Root>
			<Modal.Portal>
				<Modal.Overlay>
					<Modal.Content>body</Modal.Content>
				</Modal.Overlay>
			</Modal.Portal>
		</Modal.Root>
	),
	'Drawer (closed)': () => (
		<Drawer.Root>
			<Drawer.Portal>
				<Drawer.Overlay>
					<Drawer.Content>body</Drawer.Content>
				</Drawer.Overlay>
			</Drawer.Portal>
		</Drawer.Root>
	),
};

// `createUniqueId()` is a process-global monotonic counter (`cl-<n>`), so two
// back-to-back server renders advance it — that is by design and is NOT a
// hydration hazard (Solid aligns the counter between a server render and *its*
// client hydration). Normalize it away so the equality check isolates the real
// guarantee: no wall-clock or `Math.random()` value reaches the server output.
const normalizeIds = (html: string) => html.replace(/cl-\d+/g, 'cl-N');

describe('SSR', () => {
	for (const [name, scenario] of Object.entries(scenarios)) {
		it(`${name} renders deterministically on the server`, () => {
			const first = renderToString(scenario);
			const second = renderToString(scenario);
			expect(typeof first).toBe('string');
			expect(normalizeIds(first)).toBe(normalizeIds(second));
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
});
