import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
	rootProps: Omit<React.ComponentProps<typeof Select.Root>, 'children'> = {},
	placeholder = 'Pick a fruit',
) {
	return render(
		<Select.Root {...rootProps}>
			<Select.Trigger>
				<Select.Value placeholder={placeholder} />
			</Select.Trigger>
			<Select.Content>
				{options.map((opt) => (
					<Select.Item
						key={opt.value}
						value={opt.value}
						disabled={opt.disabled}>
						{opt.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>,
	);
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

	describe('keyboard navigation', () => {
		it('ArrowDown opens the listbox and seats the active option on the first item', async () => {
			renderSelect();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(screen.getByRole('listbox')).toBeInTheDocument();
			expect(trigger).toHaveAttribute('aria-activedescendant');
			expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
		});

		it('ArrowDown/ArrowUp move the active option and reflect it via aria-activedescendant', async () => {
			renderSelect();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}'); // open, active = Apple
			await userEvent.keyboard('{ArrowDown}'); // Banana
			expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('data-highlighted', '');
			const bananaId = screen.getByRole('option', { name: 'Banana' }).id;
			expect(trigger).toHaveAttribute('aria-activedescendant', bananaId);
			await userEvent.keyboard('{ArrowUp}'); // back to Apple
			expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
		});

		it('Enter selects the active option and closes', async () => {
			const onChange = vi.fn();
			renderSelect(undefined, { onChange });
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}'); // Apple -> Banana -> select
			expect(onChange).toHaveBeenCalledWith('banana');
			expect(screen.queryByRole('listbox')).toBeNull();
		});

		it('Home/End jump to the first and last options', async () => {
			renderSelect();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}{End}');
			expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('data-highlighted', '');
			await userEvent.keyboard('{Home}');
			expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted', '');
		});

		it('skips disabled options when navigating', async () => {
			renderSelect([
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana', disabled: true },
				{ value: 'cherry', label: 'Cherry' },
			]);
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}'); // Apple
			await userEvent.keyboard('{ArrowDown}'); // skip Banana -> Cherry
			expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('data-highlighted', '');
		});

		it('typeahead jumps the active option to a label prefix match', async () => {
			renderSelect();
			const trigger = screen.getByRole('button');
			trigger.focus();
			await userEvent.keyboard('{ArrowDown}'); // open, active = Apple
			await userEvent.keyboard('c'); // -> Cherry
			expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('data-highlighted', '');
		});

		it('select-only typeahead changes the value while closed', async () => {
			const onChange = vi.fn();
			renderSelect(undefined, { defaultValue: 'apple', onChange });
			// Register options by opening then closing.
			const trigger = screen.getByRole('button');
			await userEvent.click(trigger);
			await userEvent.keyboard('{Escape}');
			trigger.focus();
			await userEvent.keyboard('b'); // -> Banana, selected without opening
			expect(onChange).toHaveBeenCalledWith('banana');
			expect(screen.queryByRole('listbox')).toBeNull();
		});
	});
});
