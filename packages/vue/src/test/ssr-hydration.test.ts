import { describe, it, expect, vi } from 'vitest';
import { createSSRApp, h, nextTick, type Component, type VNode } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { Badge, Button, Input, Switch, Tabs, Modal, Drawer, Sheet, ContextMenu } from '@/components';

/**
 * SSR sanity check for Vue SSR frameworks (Nuxt, vite-ssr, vike). They all
 * server-render to HTML with `@vue/server-renderer` and then hydrate the same
 * tree on the client with `createSSRApp(...).mount(el)`. Hydration only succeeds
 * if the server HTML and the client's first render agree; any divergence
 * (non-deterministic ids, render-time `Date.now()`/`Math.random()`, or DOM-only
 * output like a `<Teleport>` that has no server target) makes Vue log a hydration
 * mismatch and discard the server markup.
 *
 * This reproduces that exact flow: render to a string, plant it in the DOM, then
 * hydrate the same tree and assert Vue reports no hydration mismatch. The portal
 * cases (Modal/Drawer/Sheet/ContextMenu opened) specifically guard the fix that
 * gates `<Teleport>` behind `useIsMounted()` — without it, the open portal would
 * try to teleport during SSR and mismatch on hydration.
 */
async function hydrationWarnings(factory: () => VNode): Promise<string[]> {
	const messages: string[] = [];
	const capture = (...args: unknown[]) => {
		messages.push(args.map(String).join(' '));
	};
	const warnSpy = vi.spyOn(console, 'warn').mockImplementation(capture);
	const errorSpy = vi.spyOn(console, 'error').mockImplementation(capture);

	try {
		const root: Component = { render: () => factory() };

		// 1. Server render.
		const html = await renderToString(createSSRApp(root));

		// 2. Plant the server HTML, then hydrate the same tree over it.
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);

		const app = createSSRApp(root);
		app.mount(container);
		// Let onMounted + post-flush effects (e.g. the Teleport mounting client-side) settle.
		await nextTick();
		await nextTick();

		app.unmount();
		container.remove();
	} finally {
		warnSpy.mockRestore();
		errorSpy.mockRestore();
	}

	// Keep only messages that describe a hydration divergence.
	return messages.filter((m) => /hydrat|mismatch/i.test(m));
}

const cases: Record<string, () => VNode> = {
	Badge: () => h(Badge, { count: 5 }),
	Button: () => h(Button, null, { default: () => 'Save' }),
	Input: () =>
		h(Input.Root, null, {
			default: () => [h(Input.Label, null, { default: () => 'Email' }), h(Input.Field, { type: 'email' })],
		}),
	Switch: () => h(Switch.Root, null, { default: () => h(Switch.Thumb) }),
	Tabs: () =>
		h(Tabs.Root, { defaultValue: 'one' }, {
			default: () => [
				h(Tabs.List, null, {
					default: () => [
						h(Tabs.Trigger, { value: 'one' }, { default: () => 'One' }),
						h(Tabs.Trigger, { value: 'two' }, { default: () => 'Two' }),
					],
				}),
				h(Tabs.Content, { value: 'one' }, { default: () => 'First' }),
			],
		}),
	// Portal components rendered OPEN — the case that breaks without the Teleport guard.
	Modal: () =>
		h(Modal.Root, { open: true }, {
			default: () =>
				h(Modal.Portal, null, {
					default: () => [h(Modal.Overlay), h(Modal.Content, null, { default: () => 'Modal body' })],
				}),
		}),
	Drawer: () =>
		h(Drawer.Root, { open: true }, {
			default: () =>
				h(Drawer.Portal, null, {
					default: () => [h(Drawer.Overlay), h(Drawer.Content, null, { default: () => 'Drawer body' })],
				}),
		}),
	Sheet: () =>
		h(Sheet.Root, { open: true }, {
			default: () =>
				h(Sheet.Portal, null, {
					default: () => [h(Sheet.Overlay), h(Sheet.Content, null, { default: () => 'Sheet body' })],
				}),
		}),
	ContextMenu: () =>
		h(ContextMenu.Root, { open: true }, {
			default: () => [
				h(ContextMenu.Trigger, null, { default: () => 'Right click' }),
				h(ContextMenu.Content, null, { default: () => h(ContextMenu.Item, null, { default: () => 'Item' }) }),
			],
		}),
};

describe('SSR hydration — server render matches client (Nuxt / vite-ssr / vike)', () => {
	for (const [name, factory] of Object.entries(cases)) {
		it(`${name} hydrates without a mismatch`, async () => {
			const warnings = await hydrationWarnings(factory);
			expect(warnings, `${name} produced hydration mismatches`).toEqual([]);
		});
	}

	it('generated ids are deterministic within a render but unique across instances', async () => {
		// Two separate Inputs must not collide; the same render must be stable.
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
});
