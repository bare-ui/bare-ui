import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { NumberInput } from './NumberInput';

function renderNI(props: Partial<ComponentProps<typeof NumberInput.Root>> = {}) {
	return render(() => (
		<NumberInput.Root
			min={0}
			max={10}
			step={1}
			{...props}>
			<NumberInput.Decrement>−</NumberInput.Decrement>
			<NumberInput.Field aria-label='qty' />
			<NumberInput.Increment>+</NumberInput.Increment>
		</NumberInput.Root>
	));
}

describe('NumberInput', () => {
	it('renders a spinbutton with min/max', () => {
		renderNI({ defaultValue: 3 });
		const input = screen.getByRole('spinbutton', { name: 'qty' });
		expect(input).toHaveAttribute('aria-valuemin', '0');
		expect(input).toHaveAttribute('aria-valuemax', '10');
		expect(input).toHaveAttribute('aria-valuenow', '3');
		expect(input).toHaveValue('3');
	});

	it('Increment / Decrement buttons step the value', async () => {
		const onChange = vi.fn();
		renderNI({ defaultValue: 5, onChange });
		await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
		expect(onChange).toHaveBeenLastCalledWith(6);
		await userEvent.click(screen.getByRole('button', { name: 'Decrement' }));
		expect(onChange).toHaveBeenLastCalledWith(5);
	});

	it('Arrow keys step the value', async () => {
		renderNI({ defaultValue: 5 });
		const input = screen.getByRole('spinbutton');
		input.focus();
		await userEvent.keyboard('{ArrowUp}{ArrowUp}');
		expect(input).toHaveValue('7');
		await userEvent.keyboard('{ArrowDown}');
		expect(input).toHaveValue('6');
	});

	it('Home / End jump to bounds (when finite)', async () => {
		renderNI({ defaultValue: 5 });
		const input = screen.getByRole('spinbutton');
		input.focus();
		await userEvent.keyboard('{Home}');
		expect(input).toHaveValue('0');
		await userEvent.keyboard('{End}');
		expect(input).toHaveValue('10');
	});

	it('clamps typed values on blur', async () => {
		renderNI({ defaultValue: 5 });
		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		await userEvent.clear(input);
		await userEvent.type(input, '999');
		await userEvent.tab(); // moves focus, fires blur
		expect(input).toHaveValue('10');
	});

	it('disabled: keyboard does nothing and buttons are disabled', async () => {
		const onChange = vi.fn();
		renderNI({ defaultValue: 5, disabled: true, onChange });
		const input = screen.getByRole('spinbutton');
		input.focus();
		await userEvent.keyboard('{ArrowUp}');
		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
	});

	it('Increment disabled at max boundary', () => {
		renderNI({ defaultValue: 10 });
		expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Decrement' })).not.toBeDisabled();
	});
});
