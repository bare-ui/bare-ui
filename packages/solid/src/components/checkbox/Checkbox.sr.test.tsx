import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { type ComponentProps } from 'solid-js';
import { Checkbox } from './Checkbox';
import { expectExposedAs } from '@/test/sr';

describe('Checkbox — screen reader semantics', () => {
	function renderCheckbox(rootProps: Omit<ComponentProps<typeof Checkbox.Root>, 'children'> = {}) {
		return render(() => (
			<Checkbox.Root
				aria-label='Toppings'
				{...rootProps}>
				<Checkbox.Item value='a'>
					<Checkbox.Label>Cheese</Checkbox.Label>
				</Checkbox.Item>
				<Checkbox.Item
					value='b'
					disabled>
					<Checkbox.Label>Anchovies</Checkbox.Label>
				</Checkbox.Item>
			</Checkbox.Root>
		));
	}

	it('exposes the group with its accessible name', () => {
		renderCheckbox();
		expectExposedAs('group', 'Toppings');
	});

	it('exposes each item as a checkbox named by its associated label', () => {
		renderCheckbox();
		expectExposedAs('checkbox', 'Cheese');
		expectExposedAs('checkbox', 'Anchovies');
	});

	it('reports the unchecked state initially and transitions to checked on toggle', async () => {
		renderCheckbox();
		const cheese = expectExposedAs('checkbox', 'Cheese') as HTMLInputElement;
		expect(cheese).not.toBeChecked();
		await userEvent.click(screen.getByText('Cheese').closest('div')!);
		expect(cheese).toBeChecked();
	});

	it('checks only the toggled item, leaving siblings unchecked', async () => {
		renderCheckbox();
		await userEvent.click(screen.getByText('Cheese').closest('div')!);
		expect(expectExposedAs('checkbox', 'Cheese')).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Anchovies' })).not.toBeChecked();
	});

	it('exposes a checked item from defaultValue', () => {
		renderCheckbox({ defaultValue: ['a'] });
		expect(expectExposedAs('checkbox', 'Cheese')).toBeChecked();
	});

	it('exposes a disabled item as disabled to assistive tech', () => {
		renderCheckbox();
		expect(screen.getByRole('checkbox', { name: 'Anchovies' })).toBeDisabled();
	});

	it('wires the label to the input so the name resolves via the htmlFor relationship', () => {
		renderCheckbox();
		const cheese = expectExposedAs('checkbox', 'Cheese') as HTMLInputElement;
		const label = screen.getByText('Cheese').closest('label') as HTMLLabelElement;
		expect(label).toHaveAttribute('for', cheese.id);
	});
});
