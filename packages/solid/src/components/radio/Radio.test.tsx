import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For, type ComponentProps } from 'solid-js';
import { Radio } from './Radio';

interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

function renderRadio(
	options: Option[] = [
		{ value: 'a', label: 'Option A' },
		{ value: 'b', label: 'Option B' },
		{ value: 'c', label: 'Option C' },
	],
	rootProps: Omit<ComponentProps<typeof Radio.Root>, 'children'> = {},
) {
	return render(() => (
		<Radio.Root {...rootProps}>
			<For each={options}>
				{(opt) => (
					<Radio.Item
						value={opt.value}
						disabled={opt.disabled}>
						<Radio.Indicator />
						<Radio.Label>{opt.label}</Radio.Label>
					</Radio.Item>
				)}
			</For>
		</Radio.Root>
	));
}

describe('Radio', () => {
	it('renders all items', () => {
		renderRadio();
		expect(screen.getByText('Option A')).toBeInTheDocument();
		expect(screen.getByText('Option B')).toBeInTheDocument();
		expect(screen.getByText('Option C')).toBeInTheDocument();
	});

	it('root has role="radiogroup"', () => {
		renderRadio();
		expect(screen.getByRole('radiogroup')).toBeInTheDocument();
	});

	it('clicking an item selects it (data-checked)', async () => {
		renderRadio();
		const itemA = screen.getByText('Option A').closest('div[data-checked]');
		expect(itemA).toBeNull(); // not checked yet
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		expect(screen.getByText('Option A').closest('div')).toHaveAttribute('data-checked', '');
	});

	it('selecting a new item deselects the previous one', async () => {
		renderRadio();
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		expect(screen.getByText('Option A').closest('div')).toHaveAttribute('data-checked', '');
		await userEvent.click(screen.getByText('Option B').closest('div')!);
		expect(screen.getByText('Option A').closest('div')).not.toHaveAttribute('data-checked');
		expect(screen.getByText('Option B').closest('div')).toHaveAttribute('data-checked', '');
	});

	it('defaultValue pre-selects an item', () => {
		renderRadio(undefined, { defaultValue: 'b' });
		expect(screen.getByText('Option B').closest('div')).toHaveAttribute('data-checked', '');
	});

	it('controlled value prop controls selection', () => {
		renderRadio(undefined, { value: 'c', onChange: vi.fn() });
		expect(screen.getByText('Option C').closest('div')).toHaveAttribute('data-checked', '');
	});

	it('onChange fires with item value when clicked', async () => {
		const handleChange = vi.fn();
		renderRadio(undefined, { onChange: handleChange });
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		expect(handleChange).toHaveBeenCalledWith('a');
	});

	it('disabled item cannot be selected', async () => {
		const handleChange = vi.fn();
		renderRadio(
			[
				{ value: 'a', label: 'Option A', disabled: true },
				{ value: 'b', label: 'Option B' },
			],
			{ onChange: handleChange },
		);
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		expect(handleChange).not.toHaveBeenCalled();
		expect(screen.getByText('Option A').closest('div')).not.toHaveAttribute('data-checked');
	});

	it('Indicator only renders for selected item', async () => {
		renderRadio();
		// Indicator renders only when checked
		expect(screen.queryAllByTestId('indicator')).toHaveLength(0);
		await userEvent.click(screen.getByText('Option A').closest('div')!);
		// After selecting, Indicator should be visible inside Option A's item
		const itemA = screen.getByText('Option A').closest('div')!;
		expect(itemA.querySelector('[data-checked]')).not.toBeNull();
	});

	it('all radio inputs share the same name attribute', () => {
		renderRadio(undefined, { name: 'my-group' });
		const inputs = screen.getAllByRole('radio');
		inputs.forEach((input) => expect(input).toHaveAttribute('name', 'my-group'));
	});
});
