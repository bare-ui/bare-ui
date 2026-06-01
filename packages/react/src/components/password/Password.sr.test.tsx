/**
 * Screen-reader semantics for Password. The behaviours a screen reader depends
 * on here are: the field takes its accessible NAME from the linked label, the
 * visibility Toggle's NAME flips between "Show password" and "Hide password" so
 * the user is told the current action, the required / invalid STATE is exposed
 * via aria-required / aria-invalid, and a validation message is announced
 * through the role=alert live region.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Password } from './Password';
import { expectExposedAs, expectAnnounced } from '@/test/sr';

function renderPassword(rootProps: Omit<React.ComponentProps<typeof Password.Root>, 'children'> = {}) {
	return render(
		<Password.Root {...rootProps}>
			<Password.Label>Password</Password.Label>
			<Password.Field />
			<Password.Toggle>Toggle</Password.Toggle>
			<Password.Error />
		</Password.Root>,
	);
}

describe('Password — screen reader semantics', () => {
	it('names the field from its linked label', () => {
		renderPassword();
		// A password-type input is exposed as a protected field with no textbox role,
		// but it still derives its accessible name from the linked label.
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
	});

	it('exposes the field as a named textbox once its contents are revealed', async () => {
		renderPassword();
		await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
		// Now type=text, so the field is announced as a textbox named "Password".
		expectExposedAs('textbox', 'Password');
	});

	it('names the visibility toggle and flips that name when toggled', async () => {
		renderPassword();
		const toggle = expectExposedAs('button', 'Show password');
		await userEvent.click(toggle);
		// Same control, new accessible name — the SR reads the next action.
		expectExposedAs('button', 'Hide password');
		expect(screen.queryByRole('button', { name: 'Show password' })).toBeNull();
	});

	it('exposes the required state via aria-required', () => {
		renderPassword({ isRequired: true });
		// The field is still named from "Password" even though the label prepends an
		// aria-hidden "*" (which a real screen reader drops from the computed name).
		const field = screen.getByLabelText(/Password/);
		expect(field).toHaveAttribute('aria-required', 'true');
		// The asterisk is decorative, never announced.
		expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
	});

	it('exposes the invalid state and announces the message through a live region', () => {
		const { container } = renderPassword({
			invalidType: 'required',
			errorMessage: { required: 'Password is required' },
		});
		const field = container.querySelector('input')!;
		expect(field).toHaveAttribute('aria-invalid', 'true');
		// role=alert is an assertive live region — the SR interrupts to read it.
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expectAnnounced('Password is required');
	});

	it('does not announce anything when the field is valid', () => {
		renderPassword({ errorMessage: { required: 'Password is required' } });
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
