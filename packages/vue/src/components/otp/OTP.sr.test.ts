/**
 * Screen-reader semantics for OTP. A one-time-code field is a row of separate
 * single-character inputs, so the thing that matters to VoiceOver/NVDA/JAWS is
 * that each slot has a distinct accessible NAME ("Digit 1" ... "Digit N"), that
 * typed characters become the slot's exposed VALUE, and that the decorative
 * separator is hidden so it is never announced between digits.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { OTP } from '.';

function renderOTP(length = 4) {
	const slots = Array.from({ length }, (_, i) => i);
	return render({
		components: { OTPRoot: OTP.Root, OTPSlot: OTP.Slot },
		template: `
			<OTPRoot :length="length">
				<OTPSlot v-for="i in slots" :key="i" :index="i" />
			</OTPRoot>
		`,
		setup() {
			return { slots, length };
		},
	});
}

describe('OTP — screen reader semantics', () => {
	it('exposes every slot as a textbox with a distinct positional name', () => {
		renderOTP(4);
		expectExposedAs('textbox', 'Digit 1');
		expectExposedAs('textbox', 'Digit 2');
		expectExposedAs('textbox', 'Digit 3');
		expectExposedAs('textbox', 'Digit 4');
	});

	it('reflects the typed character as the slot value a screen reader reads back', async () => {
		renderOTP(3);
		const first = expectExposedAs('textbox', 'Digit 1');
		await userEvent.click(first);
		await userEvent.type(first, '5');
		expect(first).toHaveValue('5');
	});

	it('hides the separator so it is never announced between digits', () => {
		render({
			components: { OTPRoot: OTP.Root, OTPSlot: OTP.Slot, OTPSeparator: OTP.Separator },
			template: `
				<OTPRoot :length="2">
					<OTPSlot :index="0" />
					<OTPSeparator />
					<OTPSlot :index="1" />
				</OTPRoot>
			`,
		});
		expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
	});

	it('exposes the disabled state of each slot to assistive tech', () => {
		render({
			components: { OTPRoot: OTP.Root, OTPSlot: OTP.Slot },
			template: `
				<OTPRoot :length="2" :disabled="true">
					<OTPSlot :index="0" />
					<OTPSlot :index="1" />
				</OTPRoot>
			`,
		});
		screen.getAllByRole('textbox').forEach((slot) => {
			expect(slot).toBeDisabled();
		});
	});
});
