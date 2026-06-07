/**
 * Screen-reader semantics for OTP. A one-time-code field is a row of separate
 * single-character inputs, so the thing that matters to VoiceOver/NVDA/JAWS is
 * that each slot has a distinct accessible NAME ("Digit 1" … "Digit N"), that
 * typed characters become the slot's exposed VALUE, and that the decorative
 * separator is hidden so it is never announced between digits.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import { OTP } from './OTP';
import { expectExposedAs } from '@/test/sr';

function renderOTP(length = 4) {
	return render(() => (
		<OTP.Root length={length}>
			<For each={Array.from({ length }, (_, i) => i)}>{(i) => <OTP.Slot index={i} />}</For>
		</OTP.Root>
	));
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
		render(() => (
			<OTP.Root length={2}>
				<OTP.Slot index={0} />
				<OTP.Separator />
				<OTP.Slot index={1} />
			</OTP.Root>
		));
		expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
	});

	it('exposes the disabled state of each slot to assistive tech', () => {
		render(() => (
			<OTP.Root
				length={2}
				disabled>
				<OTP.Slot index={0} />
				<OTP.Slot index={1} />
			</OTP.Root>
		));
		screen.getAllByRole('textbox').forEach((slot) => {
			expect(slot).toBeDisabled();
		});
	});
});
