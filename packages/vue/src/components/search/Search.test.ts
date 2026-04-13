import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Search } from '.';
import type { SearchOption } from './Search.types';

const options: SearchOption[] = [
	{ id: 1, title: 'React' },
	{ id: 2, title: 'Vue' },
	{ id: 3, title: 'Svelte' },
];

function renderSearch(rootProps: Record<string, unknown> = {}, items: SearchOption[] = options) {
	return render({
		setup() {
			return () =>
				h(Search.Root, { ...rootProps }, () => [
					h(Search.Input, { placeholder: 'Search...' }),
					h(Search.Content, null, () => [
						...items.map((opt) =>
							h(Search.Item, { key: opt.id, option: opt }, () => opt.title),
						),
						h(Search.Empty, null, () => 'No results'),
					]),
				]);
		},
	});
}

describe('Search', () => {
	it('renders input', () => {
		renderSearch();
		expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
	});

	it('dropdown is hidden by default', () => {
		renderSearch();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('dropdown opens on focus', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('typing updates the input value', async () => {
		const handleSearchChange = vi.fn();
		renderSearch({ onSearchChange: handleSearchChange });
		const input = screen.getByPlaceholderText('Search...');
		await userEvent.click(input);
		await userEvent.keyboard('v');
		expect(handleSearchChange).toHaveBeenCalledWith('v');
	});

	it('clicking an item calls onSelect', async () => {
		const handleSelect = vi.fn();
		renderSearch({ onSelect: handleSelect });
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		await userEvent.click(screen.getByText('Vue'));
		expect(handleSelect).toHaveBeenCalledWith(options[1]);
	});

	it('Escape closes the dropdown', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('shows empty state when no items and not loading', () => {
		render({
			setup() {
				return () =>
					h(Search.Root, { defaultOpen: true }, () => [
						h(Search.Input, { placeholder: 'Search...' }),
						h(Search.Content, null, () => [
							h(Search.Empty, null, () => 'No results found'),
						]),
					]);
			},
		});
		expect(screen.getByText('No results found')).toBeInTheDocument();
	});

	it('hides empty state when loading', () => {
		render({
			setup() {
				return () =>
					h(Search.Root, { defaultOpen: true, loading: true }, () => [
						h(Search.Input, { placeholder: 'Search...' }),
						h(Search.Content, null, () => [
							h(Search.Empty, null, () => 'No results found'),
						]),
					]);
			},
		});
		expect(screen.queryByText('No results found')).toBeNull();
	});
});
