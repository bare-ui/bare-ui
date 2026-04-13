import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { OTP } from '.';

function renderOTP(rootProps: Record<string, unknown> = {}, length = 6) {
	return render({
		setup() {
			return () =>
				h(OTP.Root, { length, ...rootProps }, () =>
					Array.from({ length }, (_, i) => h(OTP.Slot, { key: i, index: i })),
				);
		},
	});
}

describe('OTP', () => {
	it('renders the correct number of slots', () => {
		renderOTP({}, 4);
		const inputs = screen.getAllByRole('textbox');
		expect(inputs).toHaveLength(4);
	});

	it('each slot has the correct aria-label', () => {
		renderOTP({}, 4);
		expect(screen.getByLabelText('Digit 1')).toBeInTheDocument();
		expect(screen.getByLabelText('Digit 4')).toBeInTheDocument();
	});

	it('typing enters a digit and advances focus', async () => {
		renderOTP();
		const inputs = screen.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.keyboard('5');
		expect(inputs[0]).toHaveValue('5');
	});

	it('rejects non-numeric characters when pattern is numeric', async () => {
		renderOTP({ pattern: 'numeric' });
		const inputs = screen.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.keyboard('a');
		expect(inputs[0]).toHaveValue('');
	});

	it('accepts alphanumeric characters when pattern is alphanumeric', async () => {
		renderOTP({ pattern: 'alphanumeric' });
		const inputs = screen.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.keyboard('a');
		expect(inputs[0]).toHaveValue('a');
	});

	it('calls onComplete when all digits are filled', async () => {
		const handleComplete = vi.fn();
		renderOTP({ onComplete: handleComplete }, 3);
		const inputs = screen.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.keyboard('1');
		await userEvent.keyboard('2');
		await userEvent.keyboard('3');
		expect(handleComplete).toHaveBeenCalledWith('123');
	});

	it('renders defaultValue', () => {
		renderOTP({ defaultValue: '12' });
		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toHaveValue('1');
		expect(inputs[1]).toHaveValue('2');
		expect(inputs[2]).toHaveValue('');
	});

	it('disabled prevents input', () => {
		renderOTP({ disabled: true });
		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toBeDisabled();
	});

	it('Backspace clears current digit', async () => {
		renderOTP({ defaultValue: '12' });
		const inputs = screen.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.keyboard('{Backspace}');
		expect(inputs[0]).toHaveValue('');
	});

	it('renders separator', () => {
		render({
			setup() {
				return () =>
					h(OTP.Root, { length: 4 }, () => [
						h(OTP.Slot, { index: 0 }),
						h(OTP.Slot, { index: 1 }),
						h(OTP.Separator),
						h(OTP.Slot, { index: 2 }),
						h(OTP.Slot, { index: 3 }),
					]);
			},
		});

		expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument();
	});
});
