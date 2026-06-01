/**
 * Screen-reader semantics for Switch. A screen reader must announce it as a
 * "switch", read its label, and report on/off state that flips on toggle.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';
import { expectExposedAs } from '@/test/sr';

describe('Switch — screen reader semantics', () => {
	it('is exposed as a switch with its accessible name and off state', () => {
		render(<Switch.Root aria-label='Wi-Fi' />);
		const sw = expectExposedAs('switch', 'Wi-Fi');
		expect(sw).toHaveAttribute('aria-checked', 'false');
	});

	it('announces the on state after toggling', async () => {
		render(<Switch.Root aria-label='Wi-Fi' />);
		await userEvent.click(screen.getByRole('switch'));
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('reflects a controlled checked value to assistive tech', () => {
		render(
			<Switch.Root
				aria-label='Wi-Fi'
				checked
			/>,
		);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('exposes the disabled state so SR users know it is unavailable', () => {
		render(
			<Switch.Root
				aria-label='Wi-Fi'
				disabled
			/>,
		);
		expect(screen.getByRole('switch')).toBeDisabled();
	});
});
