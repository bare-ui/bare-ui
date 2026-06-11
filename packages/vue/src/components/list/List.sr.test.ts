/**
 * Screen-reader semantics for List. SR announces a list and the number of items
 * in it, then walks the items; the component must keep native list semantics
 * (ul/ol → role=list, li → role=listitem) and accept a consumer name.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { List } from '.';

describe('List — screen reader semantics', () => {
	it('exposes an unordered list as role=list with its items', () => {
		render(List, {
			slots: {
				default: () => [
					h('li', 'Alpha'),
					h('li', 'Beta'),
					h('li', 'Gamma'),
				],
			},
		});
		// A screen reader announces "list, 3 items".
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('exposes an ordered list as role=list (ordering is conveyed by the ol element)', () => {
		render(List, {
			props: { isOrdered: true },
			slots: {
				default: () => [
					h('li', 'First'),
					h('li', 'Second'),
				],
			},
		});
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('takes an accessible name from a consumer aria-label', () => {
		render(List, {
			attrs: { 'aria-label': 'Account settings' },
			slots: {
				default: () => [
					h('li', 'Profile'),
					h('li', 'Privacy'),
				],
			},
		});
		// A screen reader announces "Account settings, list".
		expectExposedAs('list', 'Account settings');
	});

	it('does not constrain navigation with an aria-orientation', () => {
		render(List, {
			slots: {
				default: () => h('li', 'Item'),
			},
		});
		expect(screen.getByRole('list')).not.toHaveAttribute('aria-orientation');
	});
});
