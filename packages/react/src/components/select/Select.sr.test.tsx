import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
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
			<Select.Trigger aria-label='Fruit'>
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

describe('Select — screen reader semantics', () => {
	it('exposes the trigger as a button that pops up a listbox', () => {
		renderSelect();
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it('falls back to the displayed value text for the accessible name when no aria-label is given', () => {
		render(
			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder='Pick a fruit' />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value='apple'>Apple</Select.Item>
				</Select.Content>
			</Select.Root>,
		);
		// With no aria-label the SR reads the trigger's text content (the placeholder).
		expectExposedAs('button', 'Pick a fruit');
	});

	it('exposes the open state on the trigger and transitions it on click', async () => {
		renderSelect();
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the dropdown as a listbox only once opened', async () => {
		renderSelect();
		expect(screen.queryByRole('listbox')).toBeNull();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('exposes each item as an option with the unselected state by default', async () => {
		renderSelect();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		const banana = expectExposedAs('option', 'Banana');
		expect(banana).toHaveAttribute('aria-selected', 'false');
	});

	it('marks the chosen option as selected and reflects its label on the trigger', async () => {
		renderSelect();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		await userEvent.click(expectExposedAs('option', 'Banana'));
		// Trigger now reads the chosen label, not the placeholder.
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveTextContent('Banana');
		// Re-open and confirm the selected option carries aria-selected=true.
		await userEvent.click(trigger);
		expect(expectExposedAs('option', 'Banana')).toHaveAttribute('aria-selected', 'true');
	});

	it('pre-selects the option matching defaultValue and exposes it as selected', async () => {
		renderSelect(undefined, { defaultValue: 'cherry' });
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		expect(expectExposedAs('option', 'Cherry')).toHaveAttribute('aria-selected', 'true');
		expect(expectExposedAs('option', 'Apple')).toHaveAttribute('aria-selected', 'false');
	});
});
