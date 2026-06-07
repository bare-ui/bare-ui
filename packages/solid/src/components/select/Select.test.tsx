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

	it('ArrowDown/ArrowUp move aria-activedescendant and data-highlighted to next/prev option', async () => {
		const user = userEvent.setup();
		renderSelect();
		const trigger = screen.getByRole('button');
		trigger.focus();
		await user.keyboard('{ArrowDown}'); // opens, seats active on first (Apple)
		const optId = (name: string) => screen.getByRole('option', { name }).id;
		expect(trigger).toHaveAttribute('aria-activedescendant', optId('Apple'));
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
		await user.keyboard('{ArrowDown}'); // -> Banana
		expect(trigger).toHaveAttribute('aria-activedescendant', optId('Banana'));
		expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('data-highlighted', '');
		await user.keyboard('{ArrowUp}'); // -> Apple
		expect(trigger).toHaveAttribute('aria-activedescendant', optId('Apple'));
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
	});

	it('Home/End jump to first/last option', async () => {
		const user = userEvent.setup();
		renderSelect();
		const trigger = screen.getByRole('button');
		trigger.focus();
		await user.keyboard('{ArrowDown}'); // open
		await user.keyboard('{End}');
		expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Cherry' }).id);
		expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('data-highlighted', '');
		await user.keyboard('{Home}');
		expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
		expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
	});

	it('Enter selects the active option and closes', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderSelect(undefined, { onChange });
		const trigger = screen.getByRole('button');
		trigger.focus();
		await user.keyboard('{ArrowDown}'); // open, active = Apple
		await user.keyboard('{ArrowDown}'); // active = Banana
		await user.keyboard('{Enter}');
		expect(onChange).toHaveBeenCalledWith('banana');
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('Space selects the active option', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderSelect(undefined, { onChange });
		const trigger = screen.getByRole('button');
		trigger.focus();
		await user.keyboard('{ArrowDown}'); // open, active = Apple
		await user.keyboard(' ');
		expect(onChange).toHaveBeenCalledWith('apple');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('ArrowDown skips disabled options', async () => {
		const user = userEvent.setup();
		renderSelect([
			{ value: 'apple', label: 'Apple' },
			{ value: 'banana', label: 'Banana', disabled: true },
			{ value: 'cherry', label: 'Cherry' },
		]);
		const trigger = screen.getByRole('button');
		trigger.focus();
		await user.keyboard('{ArrowDown}'); // open, active = Apple
		await user.keyboard('{ArrowDown}'); // skips disabled Banana -> Cherry
		expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Cherry' }).id);
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
