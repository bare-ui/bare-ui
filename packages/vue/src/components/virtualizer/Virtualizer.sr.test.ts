import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Virtualizer } from '.';

describe('Virtualizer — screen reader semantics', () => {
	it.skip('exposes a keyboard-operable scroll container', () => {
		// The Vue implementation does not add tabindex="0" to the scroll container.
		// This feature is present in the React implementation (tabIndex={0}) but has
		// not been ported to the Vue component; skipping until the Vue component is
		// updated to include the tabindex attribute for keyboard operability.
	});

	it('is headless: adds no list/grid role on its own — consumers supply the collection semantics', () => {
		render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 100, estimateSize: 40, 'data-testid': 'vroot' },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		const root = screen.getByTestId('vroot');
		// The component does not invent a role; it would be wrong to claim "list" while
		// most rows are unmounted. Semantics are the consumer's responsibility.
		expect(root).not.toHaveAttribute('role');
		expect(root).not.toHaveAttribute('aria-hidden');
	});

	it('exposes consumer-supplied collection roles to the a11y tree', () => {
		// When the consumer opts into a listbox + options, those roles are passed through.
		render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 50, estimateSize: 40, role: 'listbox', 'aria-label': 'Cities' },
					{
						default: ({ index }: { index: number }) => h('div', { role: 'option' }, `City ${index}`),
					},
				),
		});
		const listbox = expectExposedAs('listbox', 'Cities');
		// SR caveat: only the rendered window of options is in the DOM/a11y tree — the
		// far-offscreen rows are not announceable until scrolled into view.
		expect(within(listbox).getAllByRole('option').length).toBeGreaterThan(0);
	});
});
