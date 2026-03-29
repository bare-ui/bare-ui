import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OTP } from './OTP';

function renderOTP(rootProps: Omit<React.ComponentProps<typeof OTP.Root>, 'children'> = {}) {
	const length = rootProps.length ?? 6;
	return render(
		<OTP.Root
			length={length}
			{...rootProps}>
			{Array.from({ length }, (_, i) => (
				<OTP.Slot
					key={i}
					index={i}
					data-testid={`slot-${i}`}
				/>
			))}
		</OTP.Root>,
	);
}

describe('OTP', () => {
	it('renders correct number of slots', () => {
		renderOTP({ length: 4 });
		expect(screen.getAllByRole('textbox')).toHaveLength(4);
	});

	it('slots have aria-label "Digit N"', () => {
		renderOTP({ length: 3 });
		expect(screen.getByLabelText('Digit 1')).toBeInTheDocument();
		expect(screen.getByLabelText('Digit 3')).toBeInTheDocument();
	});

	it('typing a digit fills the slot and moves focus to next', async () => {
		renderOTP({ length: 3 });
		const slot0 = screen.getByLabelText('Digit 1');
		await userEvent.click(slot0);
		await userEvent.type(slot0, '5');
		expect(slot0).toHaveValue('5');
	});

	it('onChange fires with the current value on digit entry', async () => {
		const handleChange = vi.fn();
		renderOTP({ length: 3, onChange: handleChange });
		const slot0 = screen.getByLabelText('Digit 1');
		await userEvent.click(slot0);
		await userEvent.type(slot0, '7');
		expect(handleChange).toHaveBeenCalledWith('7');
	});

	it('non-numeric characters are rejected in numeric mode', async () => {
		const handleChange = vi.fn();
		renderOTP({ length: 3, pattern: 'numeric', onChange: handleChange });
		const slot0 = screen.getByLabelText('Digit 1');
		await userEvent.click(slot0);
		await userEvent.type(slot0, 'a');
		expect(handleChange).not.toHaveBeenCalled();
		expect(slot0).toHaveValue('');
	});

	it('alphanumeric pattern accepts letters', async () => {
		const handleChange = vi.fn();
		renderOTP({ length: 3, pattern: 'alphanumeric', onChange: handleChange });
		const slot0 = screen.getByLabelText('Digit 1');
		await userEvent.click(slot0);
		await userEvent.type(slot0, 'a');
		expect(handleChange).toHaveBeenCalledWith('a');
	});

	it('onComplete fires when all slots are filled', async () => {
		const handleComplete = vi.fn();
		renderOTP({ length: 3, onComplete: handleComplete });
		const slots = screen.getAllByRole('textbox');
		// Type into each slot directly
		await userEvent.click(slots[0]);
		await userEvent.type(slots[0], '1');
		await userEvent.type(slots[1], '2');
		await userEvent.type(slots[2], '3');
		expect(handleComplete).toHaveBeenCalledWith('123');
	});

	it('defaultValue fills slots on mount', () => {
		renderOTP({ length: 4, defaultValue: '1234' });
		expect(screen.getByLabelText('Digit 1')).toHaveValue('1');
		expect(screen.getByLabelText('Digit 4')).toHaveValue('4');
	});

	it('disabled slots are not editable', () => {
		renderOTP({ length: 3, disabled: true });
		screen.getAllByRole('textbox').forEach((slot) => {
			expect(slot).toBeDisabled();
		});
	});

	it('disabled root has data-disabled attribute', () => {
		const { container } = renderOTP({ length: 3, disabled: true });
		expect(container.firstChild).toHaveAttribute('data-disabled', '');
	});

	it('data-complete is present when all slots filled', async () => {
		const { container } = renderOTP({ length: 2 });
		const slots = screen.getAllByRole('textbox');
		await userEvent.click(slots[0]);
		await userEvent.type(slots[0], '1');
		await userEvent.type(slots[1], '2');
		expect(container.firstChild).toHaveAttribute('data-complete', '');
	});

	it('Backspace clears current slot', async () => {
		renderOTP({ length: 3, defaultValue: '123' });
		const slot2 = screen.getByLabelText('Digit 3');
		await userEvent.click(slot2);
		await userEvent.keyboard('{Backspace}');
		expect(slot2).toHaveValue('');
	});

	it('OTP.Separator renders with role="separator"', () => {
		render(
			<OTP.Root length={2}>
				<OTP.Slot index={0} />
				<OTP.Separator />
				<OTP.Slot index={1} />
			</OTP.Root>,
		);
		expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument();
	});
});
