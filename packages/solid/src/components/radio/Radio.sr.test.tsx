import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Radio } from './Radio';
import { expectExposedAs } from '@/test/sr';

describe('Radio — screen reader semantics', () => {
	function renderRadio(rootProps: Omit<ComponentProps<typeof Radio.Root>, 'children'> = {}) {
		return render(() => (
			<Radio.Root
				aria-label='Shipping speed'
				{...rootProps}>
				<Radio.Item value='std'>
					<Radio.Indicator />
					<Radio.Label>Standard</Radio.Label>
				</Radio.Item>
				<Radio.Item value='exp'>
					<Radio.Indicator />
					<Radio.Label>Express</Radio.Label>
				</Radio.Item>
				<Radio.Item
					value='ovn'
					disabled>
					<Radio.Indicator />
					<Radio.Label>Overnight</Radio.Label>
				</Radio.Item>
			</Radio.Root>
		));
	}

	it('exposes the radiogroup with its accessible name', () => {
		renderRadio();
		expectExposedAs('radiogroup', 'Shipping speed');
	});

	it('exposes each item as a radio named by its associated label', () => {
		renderRadio();
		expectExposedAs('radio', 'Standard');
		expectExposedAs('radio', 'Express');
		expectExposedAs('radio', 'Overnight');
	});

	it('reports the unselected state initially and transitions to checked on selection', async () => {
		renderRadio();
		const std = expectExposedAs('radio', 'Standard') as HTMLInputElement;
		expect(std).not.toBeChecked();
		await userEvent.click(screen.getByText('Standard'));
		expect(std).toBeChecked();
	});

	it('exposes exactly one checked radio, moving the checked state on a new selection', async () => {
		renderRadio();
		await userEvent.click(screen.getByText('Standard'));
		expect(expectExposedAs('radio', 'Standard')).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Express' })).not.toBeChecked();

		await userEvent.click(screen.getByText('Express'));
		expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
		expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
	});

	it('exposes a checked radio from defaultValue', () => {
		renderRadio({ defaultValue: 'exp' });
		expect(expectExposedAs('radio', 'Express')).toBeChecked();
	});

	it('exposes a disabled item as disabled to assistive tech', () => {
		renderRadio();
		expect(screen.getByRole('radio', { name: 'Overnight' })).toBeDisabled();
	});

	it('wires the label to the input so the name resolves via the htmlFor relationship', () => {
		renderRadio();
		const std = expectExposedAs('radio', 'Standard') as HTMLInputElement;
		const label = screen.getByText('Standard').closest('label') as HTMLLabelElement;
		expect(label).toHaveAttribute('for', std.id);
	});
});
