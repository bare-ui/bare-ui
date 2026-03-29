import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

const options = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' },
];

function renderSearch(rootProps: Omit<React.ComponentProps<typeof Search.Root>, 'children'> = {}) {
	return render(
		<Search.Root
			searchDelay={0}
			{...rootProps}>
			<Search.Input placeholder='Search...' />
			<Search.Content>
				{options.map((opt) => (
					<Search.Item
						key={opt.value}
						option={opt}>
						{opt.label}
					</Search.Item>
				))}
				<Search.Empty>No results</Search.Empty>
			</Search.Content>
		</Search.Root>,
	);
}

describe('Search', () => {
	it('renders the search input', () => {
		renderSearch();
		expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
	});

	it('dropdown is not visible initially', () => {
		renderSearch();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('focusing the input opens the dropdown', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('shows items in the dropdown when open', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});

	it('typing updates the search value', async () => {
		renderSearch();
		await userEvent.type(screen.getByPlaceholderText('Search...'), 'app');
		expect(screen.getByPlaceholderText('Search...')).toHaveValue('app');
	});

	it('onSearchChange fires as user types', async () => {
		const handleSearchChange = vi.fn();
		renderSearch({ onSearchChange: handleSearchChange });
		await userEvent.type(screen.getByPlaceholderText('Search...'), 'ba');
		expect(handleSearchChange).toHaveBeenCalledWith('b');
		expect(handleSearchChange).toHaveBeenCalledWith('ba');
	});

	it('clicking an item fires onSelect', async () => {
		const handleSelect = vi.fn();
		renderSearch({ onSelect: handleSelect });
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		await userEvent.click(screen.getByText('Banana'));
		expect(handleSelect).toHaveBeenCalledWith({ value: 'banana', label: 'Banana' });
	});

	it('clicking an item closes the dropdown', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		await userEvent.click(screen.getByText('Apple'));
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('Escape key closes the dropdown', async () => {
		renderSearch();
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('Empty shows when there are no items (rendered with empty content)', async () => {
		render(
			<Search.Root searchDelay={0}>
				<Search.Input placeholder='Search...' />
				<Search.Content>
					<Search.Empty>No results</Search.Empty>
				</Search.Content>
			</Search.Root>,
		);
		await userEvent.click(screen.getByPlaceholderText('Search...'));
		expect(screen.getByText('No results')).toBeInTheDocument();
	});

	it('data-loading attribute on root when loading=true', () => {
		const { container } = renderSearch({ loading: true });
		expect(container.firstChild).toHaveAttribute('data-loading', '');
	});

	it('controlled open=true shows dropdown', () => {
		renderSearch({ open: true });
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('controlled open=false hides dropdown', () => {
		renderSearch({ open: false });
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('ArrowDown highlights the first item', async () => {
		renderSearch();
		const input = screen.getByPlaceholderText('Search...');
		await userEvent.click(input);
		await userEvent.keyboard('{ArrowDown}');
		const items = screen.getAllByRole('option');
		expect(items[0]).toHaveAttribute('data-highlighted', '');
	});
});
