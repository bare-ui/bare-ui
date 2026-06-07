/**
 * Screen-reader semantics for List. SR announces a list and the number of items
 * in it, then walks the items; the component must keep native list semantics
 * (ul/ol → role=list, li → role=listitem) and accept a consumer name.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { List } from './List';

describe('List — screen reader semantics', () => {
	it('exposes an unordered list as role=list with its items', () => {
		render(() => (
			<List>
				<li>Alpha</li>
				<li>Beta</li>
				<li>Gamma</li>
			</List>
		));
		// A screen reader announces "list, 3 items".
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('exposes an ordered list as role=list (ordering is conveyed by the ol element)', () => {
		render(() => (
			<List isOrdered>
				<li>First</li>
				<li>Second</li>
			</List>
		));
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('takes an accessible name from a consumer aria-label', () => {
		render(() => (
			<List aria-label='Account settings'>
				<li>Profile</li>
				<li>Privacy</li>
			</List>
		));
		// A screen reader announces "Account settings, list".
		expectExposedAs('list', 'Account settings');
	});

	it('does not constrain navigation with an aria-orientation', () => {
		render(() => (
			<List>
				<li>Item</li>
			</List>
		));
		expect(screen.getByRole('list')).not.toHaveAttribute('aria-orientation');
	});
});
