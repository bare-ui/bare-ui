/**
 * Screen-reader semantics for Form. The field wires a control to its label,
 * description, and error so a screen reader announces the name, required and
 * invalid states, and reads the hint + error as the control's description.
 */
import { describe, it, expect } from 'vitest';
import { createSignal } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import { Form } from './Form';
import { expectExposedAs, expectAnnounced } from '@/test/sr';

function renderForm({ invalid = false, required = false } = {}) {
	return render(() => (
		<Form.Root>
			<Form.Field
				name='email'
				invalid={invalid}
				required={required}>
				<Form.Label>Email</Form.Label>
				<Form.Control>
					<input type='email' />
				</Form.Control>
				<Form.Description>We'll never share it</Form.Description>
				<Form.Error>Enter a valid email</Form.Error>
			</Form.Field>
		</Form.Root>
	));
}

describe('Form — screen reader semantics', () => {
	it('announces the control by its label and exposes the required state', () => {
		renderForm({ required: true });
		const input = expectExposedAs('textbox', 'Email');
		expect(input).toHaveAttribute('aria-required', 'true');
	});

	it('does not expose required or invalid on a clean optional field', () => {
		renderForm();
		const input = screen.getByRole('textbox', { name: 'Email' });
		expect(input).not.toHaveAttribute('aria-required');
		expect(input).not.toHaveAttribute('aria-invalid');
	});

	it('reads the description as the control accessible description', () => {
		renderForm();
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription("We'll never share it");
	});

	it('marks the field invalid and folds the error into the accessible description', () => {
		renderForm({ invalid: true });
		const input = screen.getByRole('textbox', { name: 'Email' });
		expect(input).toHaveAttribute('aria-invalid', 'true');
		// SR reads both the hint and the error message as the field's description.
		expect(input).toHaveAccessibleDescription("We'll never share it Enter a valid email");
	});

	it('announces the error through a live region when the field becomes invalid', () => {
		const [invalid, setInvalid] = createSignal(false);
		render(() => (
			<Form.Root>
				<Form.Field
					name='email'
					invalid={invalid()}>
					<Form.Label>Email</Form.Label>
					<Form.Control>
						<input type='email' />
					</Form.Control>
					<Form.Error>Enter a valid email</Form.Error>
				</Form.Field>
			</Form.Root>
		));
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		setInvalid(true);
		expectExposedAs('alert');
		expectAnnounced('Enter a valid email');
	});
});
