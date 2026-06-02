import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

function renderCheckbox(
	options: Option[] = [
		{ value: 'a', label: 'Option A' },
		{ value: 'b', label: 'Option B' },
		{ value: 'c', label: 'Option C' },
	],
	rootProps: Omit<React.ComponentProps<typeof Checkbox.Root>, 'children'> = {},
) {
	return render(
		<Checkbox.Root {...rootProps}>
			{options.map((opt) => (
				<Checkbox.Item
					key={opt.value}
					value={opt.value}
					disabled={opt.disabled}>
					<Checkbox.Label>{opt.label}</Checkbox.Label>
				</Checkbox.Item>
			))}
		</Checkbox.Root>,
	);
}

describe('Checkbox', () => {
	it('renders all items', () => {
		renderCheckbox();
		expect(screen.getByText('Option A')).toBeInTheDocument();
		expect(screen.getByText('Option B')).toBeInTheDocument();
		expect(screen.getByText('Option C')).toBeInTheDocument();
	});

	it('clicking an item adds data-checked', async () => {
		renderCheckbox();
		const itemA = screen.getByText('Option A').closest('div')!;
		expect(itemA).not.toHaveAttribute('data-checked');
		await userEvent.click(itemA);
		expect(itemA).toHaveAttribute('data-checked', '');
	});

	it('clicking a checked item removes data-checked', async () => {
		renderCheckbox();
		const itemA = screen.getByText('Option A').closest('div')!;
		await userEvent.click(itemA);
		expect(itemA).toHaveAttribute('data-checked', '');
		await userEvent.click(itemA);
		expect(itemA).not.toHaveAttribute('data-checked');
	});

	it('defaultValue pre-selects items', () => {
		renderCheckbox(undefined, { defaultValue: ['a', 'c'] });
		const itemA = screen.getByText('Option A').closest('div')!;
		const itemB = screen.getByText('Option B').closest('div')!;
		const itemC = screen.getByText('Option C').closest('div')!;
		expect(itemA).toHaveAttribute('data-checked', '');
		expect(itemB).not.toHaveAttribute('data-checked');
		expect(itemC).toHaveAttribute('data-checked', '');
	});

	it('controlled value prop controls selection', () => {
		renderCheckbox(undefined, { value: ['b'] });
		expect(screen.getByText('Option A').closest('div')).not.toHaveAttribute('data-checked');
		expect(screen.getByText('Option B').closest('div')).toHaveAttribute('data-checked', '');
		expect(screen.getByText('Option C').closest('div')).not.toHaveAttribute('data-checked');
	});

	it('onChange fires with updated array when item clicked', async () => {
		const handleChange = vi.fn();
		renderCheckbox(undefined, { onChange: handleChange });
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		expect(handleChange).toHaveBeenCalledWith(['a']);
		await userEvent.click(screen.getByText('Option B').closest('div')!);
		expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
	});

	it('disabled item cannot be toggled', async () => {
		const handleChange = vi.fn();
		renderCheckbox(
			[
				{ value: 'a', label: 'Option A', disabled: true },
				{ value: 'b', label: 'Option B' },
			],
			{ onChange: handleChange },
		);
		const disabledItem = screen.getByText('Option A').closest('div')!;
		await userEvent.click(disabledItem);
		expect(handleChange).not.toHaveBeenCalled();
		expect(disabledItem).not.toHaveAttribute('data-checked');
	});

	it('multiple items can be selected simultaneously', async () => {
		renderCheckbox();
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		await userEvent.click(screen.getByText('Option B').closest('div')!);
		expect(screen.getByText('Option A').closest('div')).toHaveAttribute('data-checked', '');
		expect(screen.getByText('Option B').closest('div')).toHaveAttribute('data-checked', '');
	});

	it('indeterminate sets the native input property and a data hook', () => {
		render(
			<Checkbox.Root>
				<Checkbox.Item value='all' indeterminate>
					<Checkbox.Label>Select all</Checkbox.Label>
				</Checkbox.Item>
			</Checkbox.Root>,
		);
		const input = screen.getByRole('checkbox') as HTMLInputElement;
		expect(input.indeterminate).toBe(true);
		expect(screen.getByText('Select all').closest('div')).toHaveAttribute('data-indeterminate', '');
	});
});
