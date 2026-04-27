import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For, type ComponentProps } from 'solid-js';
import { Select } from './Select';

interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

function renderSelect(
	options: SelectOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
	],
	rootProps: Omit<ComponentProps<typeof Select.Root>, 'children'> = {},
	placeholder = 'Pick a fruit',
) {
	return render(() => (
		<Select.Root {...rootProps}>
			<Select.Trigger>
				<Select.Value placeholder={placeholder} />
			</Select.Trigger>
			<Select.Content>
				<For each={options}>
					{(opt) => (
						<Select.Item
							value={opt.value}
							disabled={opt.disabled}>
							{opt.label}
						</Select.Item>
					)}
				</For>
			</Select.Content>
		</Select.Root>
	));
}

describe('Select', () => {
	it('shows placeholder when nothing is selected', () => {
		renderSelect();
		expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
	});

	it('clicking trigger opens dropdown (data-state="open" on trigger)', async () => {
		renderSelect();
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('data-state', 'closed');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('dropdown is not visible before trigger click', () => {
		renderSelect();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('clicking an item closes dropdown and shows selected label in Select.Value', async () => {
		renderSelect();
		await userEvent.click(screen.getByRole('button'));
		await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('defaultValue pre-selects an item and shows its label', async () => {
		renderSelect(undefined, { defaultValue: 'apple' });
		// Open to register labels then close
		await userEvent.click(screen.getByRole('button'));
		await userEvent.keyboard('{Escape}');
		expect(screen.getByText('Apple')).toBeInTheDocument();
	});

	it('controlled value prop shows correct label', async () => {
		renderSelect(undefined, { value: 'cherry' });
		// open and close to allow item registration
		await userEvent.click(screen.getByRole('button'));
		await userEvent.keyboard('{Escape}');
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});

	it('onChange fires with item value when item is selected', async () => {
		const handleChange = vi.fn();
		renderSelect(undefined, { onChange: handleChange });
		await userEvent.click(screen.getByRole('button'));
		await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
		expect(handleChange).toHaveBeenCalledWith('apple');
	});

	it('disabled select cannot be opened', async () => {
		renderSelect(undefined, { disabled: true });
		await userEvent.click(screen.getByRole('button'));
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(screen.getByRole('button')).toHaveAttribute('data-state', 'closed');
	});

	it('Escape key closes the dropdown', async () => {
		renderSelect();
		const trigger = screen.getByRole('button');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('data-state', 'open');
		trigger.focus();
		await userEvent.keyboard('{Escape}');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});
});
