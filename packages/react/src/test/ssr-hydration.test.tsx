import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import type { ReactElement } from 'react';
import { Badge, Button, Checkbox, Input, Password, Radio, Switch, Tabs, Textarea } from '@/components';

/**
 * SSR sanity check for SSR frameworks (Next.js, Remix / React Router 7, TanStack
 * Start). They all server-render to HTML with `react-dom/server` and then call
 * `hydrateRoot` in the browser. Hydration only succeeds if the server HTML and
 * the client's first render are byte-identical; any divergence (non-deterministic
 * ids, render-time `new Date()`/`Math.random()`, etc.) makes React log an error
 * and throw the server markup away.
 *
 * This reproduces that exact flow: render to a string, plant it in the DOM, then
 * hydrate the same tree and assert React reports no recoverable/hydration errors.
 * A regression to random ids (the bug `useId()` replaced) fails here because the
 * server pass and the hydration pass would mint different ids.
 */
function hydrationDiagnostics(element: ReactElement): { recoverable: unknown[]; consoleErrors: string[] } {
	const consoleErrors: string[] = [];
	const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
		consoleErrors.push(args.map(String).join(' '));
	});

	const html = renderToString(element);
	const container = document.createElement('div');
	container.innerHTML = html;
	document.body.appendChild(container);

	const recoverable: unknown[] = [];
	let root: ReturnType<typeof hydrateRoot>;
	act(() => {
		root = hydrateRoot(container, element, {
			// In React 19 a hydration mismatch surfaces here before anything else.
			onRecoverableError: (error) => recoverable.push(error),
		});
	});

	act(() => root.unmount());
	container.remove();
	errorSpy.mockRestore();

	// Keep only console errors that describe a hydration divergence.
	const hydrationErrors = consoleErrors.filter((m) =>
		/hydrat|did(n't| not) match|server[- ]rendered|text content/i.test(m),
	);
	return { recoverable, consoleErrors: hydrationErrors };
}

const cases: Record<string, ReactElement> = {
	Badge: <Badge count={5} />,
	Button: <Button>Save</Button>,
	Input: (
		<Input.Root>
			<Input.Label>Email</Input.Label>
			<Input.Field type='email' />
		</Input.Root>
	),
	Textarea: (
		<Textarea.Root>
			<Textarea.Label>Message</Textarea.Label>
			<Textarea.Field rows={3} />
		</Textarea.Root>
	),
	Password: (
		<Password.Root>
			<Password.Label>Password</Password.Label>
			<Password.Field />
		</Password.Root>
	),
	Radio: (
		<Radio.Root>
			<Radio.Item value='a'>
				<Radio.Indicator />
				<Radio.Label>Option A</Radio.Label>
			</Radio.Item>
			<Radio.Item value='b'>
				<Radio.Indicator />
				<Radio.Label>Option B</Radio.Label>
			</Radio.Item>
		</Radio.Root>
	),
	Checkbox: (
		<Checkbox.Root>
			<Checkbox.Item value='x'>
				<Checkbox.Indicator />
				<Checkbox.Label>Accept</Checkbox.Label>
			</Checkbox.Item>
		</Checkbox.Root>
	),
	Switch: (
		<Switch.Root>
			<Switch.Thumb />
		</Switch.Root>
	),
	Tabs: (
		<Tabs.Root defaultValue='one'>
			<Tabs.List>
				<Tabs.Trigger value='one'>One</Tabs.Trigger>
				<Tabs.Trigger value='two'>Two</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='one'>First</Tabs.Content>
		</Tabs.Root>
	),
};

describe('SSR hydration — server render matches client (Next/Remix/TanStack Start)', () => {
	for (const [name, element] of Object.entries(cases)) {
		it(`${name} hydrates without a mismatch`, () => {
			const { recoverable, consoleErrors } = hydrationDiagnostics(element);
			expect(recoverable, `${name} produced recoverable (hydration) errors`).toEqual([]);
			expect(consoleErrors, `${name} logged hydration warnings`).toEqual([]);
		});
	}

	it('generated ids are deterministic within a render but unique across instances', () => {
		// Two separate Inputs must not collide; the same Input must be stable.
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
		expect(new Set(ids).size).toBe(ids.length); // all unique, no random collisions
	});
});
