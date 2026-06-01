import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';
import { expectExposedAs } from '@/test/sr';

function renderNI(props: Partial<React.ComponentProps<typeof NumberInput.Root>> = {}) {
	return render(
		<NumberInput.Root
			min={0}
			max={10}
			step={1}
			{...props}>
			<NumberInput.Decrement>−</NumberInput.Decrement>
			<NumberInput.Field aria-label='Quantity' />
			<NumberInput.Increment>+</NumberInput.Increment>
		</NumberInput.Root>,
	);
}

describe('NumberInput — screen reader semantics', () => {
	it('is exposed as a spinbutton with name and value range', () => {
		renderNI({ defaultValue: 3 });
		const field = expectExposedAs('spinbutton', 'Quantity');
		expect(field).toHaveAttribute('aria-valuenow', '3');
		expect(field).toHaveAttribute('aria-valuemin', '0');
		expect(field).toHaveAttribute('aria-valuemax', '10');
	});

	it('updates the announced value when stepped via arrow keys', async () => {
		renderNI({ defaultValue: 5 });
		const field = expectExposedAs('spinbutton', 'Quantity');
		field.focus();
		await userEvent.keyboard('{ArrowUp}');
		expect(field).toHaveAttribute('aria-valuenow', '6');
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		expect(field).toHaveAttribute('aria-valuenow', '4');
	});

	it('updates the announced value when stepped via the buttons', async () => {
		renderNI({ defaultValue: 5 });
		const field = expectExposedAs('spinbutton', 'Quantity');
		await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
		expect(field).toHaveAttribute('aria-valuenow', '6');
		await userEvent.click(screen.getByRole('button', { name: 'Decrement' }));
		expect(field).toHaveAttribute('aria-valuenow', '5');
	});

	it('omits aria-valuenow while empty so no value is announced', () => {
		renderNI({ defaultValue: null });
		expect(expectExposedAs('spinbutton', 'Quantity')).not.toHaveAttribute('aria-valuenow');
	});

	it('exposes the step buttons with their own accessible names', () => {
		renderNI();
		expect(expectExposedAs('button', 'Increment')).toBeInTheDocument();
		expect(expectExposedAs('button', 'Decrement')).toBeInTheDocument();
	});
});
