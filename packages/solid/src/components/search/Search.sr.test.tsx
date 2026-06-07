/**
 * Screen-reader semantics for Search. Verifies the parts a screen reader relies
 * on as the user types and arrows through results: the input is reachable by its
 * accessible NAME, the results popover is exposed as a listbox of options, each
 * option carries its name, and the highlighted option's aria-selected STATE moves
 * with keyboard navigation so the SR announces which result is active.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For, type ComponentProps } from 'solid-js';
import { Search } from './Search';
import { expectExposedAs } from '@/test/sr';

const options = [
	{ id: 'apple', title: 'Apple' },
	{ id: 'banana', title: 'Banana' },
	{ id: 'cherry', title: 'Cherry' },
];

function renderSearch(rootProps: Omit<ComponentProps<typeof Search.Root>, 'children'> = {}) {
	return render(() => (
		<Search.Root
			searchDelay={0}
			{...rootProps}>
			<Search.Input aria-label='Search fruit' />
			<Search.Content aria-label='Fruit results'>
				<For each={options}>{(opt) => <Search.Item option={opt}>{opt.title}</Search.Item>}</For>
			</Search.Content>
		</Search.Root>
	));
}

describe('Search — screen reader semantics', () => {
	it('names the search input from its consumer-supplied label', () => {
		renderSearch();
		expectExposedAs('textbox', 'Search fruit');
	});

	it('exposes the open results as a named listbox of options', async () => {
		renderSearch();
		await userEvent.click(screen.getByRole('textbox', { name: 'Search fruit' }));
		const listbox = expectExposedAs('listbox', 'Fruit results');
		expect(within(listbox).getAllByRole('option')).toHaveLength(3);
		expectExposedAs('option', 'Apple');
		expectExposedAs('option', 'Banana');
		expectExposedAs('option', 'Cherry');
	});

	it('moves the aria-selected state to the highlighted option on arrow navigation', async () => {
		renderSearch();
		await userEvent.click(screen.getByRole('textbox', { name: 'Search fruit' }));
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
		await userEvent.keyboard('{ArrowDown}');
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
		expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
	});

	it('removes the listbox from the accessibility tree when the results close', async () => {
		renderSearch();
		await userEvent.click(screen.getByRole('textbox', { name: 'Search fruit' }));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).toBeNull();
	});
});
