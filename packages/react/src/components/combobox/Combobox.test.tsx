import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

const options = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'solid', label: 'Solid', disabled: true },
];

function renderCB(props: Partial<React.ComponentProps<typeof Combobox.Root>> = {}) {
	return render(
		<Combobox.Root options={options} {...props}>
			<Combobox.Input aria-label='framework' />
			<Combobox.Trigger>▾</Combobox.Trigger>
			<Combobox.Content>
				<Combobox.Items>
					{({ option, highlighted, selected }) => (
						<div data-state={highlighted ? 'highlighted' : selected ? 'selected' : 'idle'}>{option.label}</div>
					)}
				</Combobox.Items>
				<Combobox.Empty>No results</Combobox.Empty>
			</Combobox.Content>
		</Combobox.Root>,
	);
}

describe('Combobox', () => {
	it('renders combobox role with proper ARIA wiring', () => {
		renderCB();
		const input = screen.getByRole('combobox', { name: 'framework' });
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(input).toHaveAttribute('aria-controls');
	});

	it('opens on focus and shows the listbox', async () => {
		renderCB();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
	});

	it('filters options as the user types', async () => {
		renderCB();
		const input = screen.getByRole('combobox');
		await userEvent.type(input, 'sve');
		const options = screen.getAllByRole('option').map((o) => o.textContent);
		expect(options).toEqual(['Svelte']);
	});

	it('Enter commits the highlighted option and fires onChange', async () => {
		const onChange = vi.fn();
		renderCB({ onChange });
		const input = screen.getByRole('combobox');
		await userEvent.click(input);
		await userEvent.keyboard('{ArrowDown}{Enter}');
		expect(onChange).toHaveBeenCalled();
		expect((input as HTMLInputElement).value.length).toBeGreaterThan(0);
	});

	it('Escape closes the listbox', async () => {
		renderCB();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);
		expect(screen.queryByRole('listbox')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('arrow navigation skips disabled options', async () => {
		renderCB();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);
		// 4 options, "Solid" is disabled. Cycle through with ArrowDown — none of the
		// highlighted states should ever land on "Solid".
		for (let i = 0; i < 6; i++) {
			await userEvent.keyboard('{ArrowDown}');
			const highlighted = screen.queryByText((_, el) => el?.getAttribute('data-state') === 'highlighted');
			expect(highlighted?.textContent).not.toBe('Solid');
		}
	});

	it('Empty renders when no matches', async () => {
		renderCB();
		const input = screen.getByRole('combobox');
		await userEvent.type(input, 'zzzzz');
		expect(screen.getByText('No results')).toBeInTheDocument();
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('clicking an option commits selection', async () => {
		const onChange = vi.fn();
		renderCB({ onChange });
		await userEvent.click(screen.getByRole('combobox'));
		await userEvent.click(screen.getByText('Vue'));
		expect(onChange).toHaveBeenCalledWith('vue', expect.objectContaining({ value: 'vue' }));
	});
});
