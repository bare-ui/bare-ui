/**
 * Screen-reader semantics for Input. The field is a textbox named by its label,
 * exposes its required and invalid states to assistive tech, and — when errored —
 * is described by the error message (which is also announced via an alert region).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import type { ComponentProps } from 'solid-js';
import { Input } from './Input';
import { expectExposedAs } from '@/test/sr';

function renderInput(
	rootProps: Omit<ComponentProps<typeof Input.Root>, 'children'> = {},
	fieldProps: ComponentProps<typeof Input.Field> = {},
) {
	return render(() => (
		<Input.Root {...rootProps}>
			<Input.Label>Email</Input.Label>
			<Input.Field
				placeholder='Enter email'
				{...fieldProps}
			/>
			<Input.Error />
		</Input.Root>
	));
}

describe('Input — screen reader semantics', () => {
	it('is exposed as a textbox named by its label', () => {
		renderInput();
		const field = expectExposedAs('textbox', 'Email');
		expect(field).toBe(screen.getByPlaceholderText('Enter email'));
	});

	it('exposes the required state to assistive tech', () => {
		renderInput({ isRequired: true });
		// The required marker `*` is part of the label, so the announced name is "*Email".
		const field = expectExposedAs('textbox', '*Email');
		expect(field).toHaveAttribute('aria-required', 'true');
		expect(field).toBeRequired();
	});

	it('does not announce required when not required', () => {
		renderInput();
		expect(expectExposedAs('textbox', 'Email')).not.toHaveAttribute('aria-required');
	});

	it('marks the field invalid and describes it by the error message when errored', () => {
		renderInput({ invalidType: 'email', errorMessage: { email: 'Enter a valid email address' } });
		const field = expectExposedAs('textbox', 'Email');
		expect(field).toHaveAttribute('aria-invalid', 'true');

		const describedby = field.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		const description = document.getElementById(describedby!);
		expect(description).toHaveTextContent('Enter a valid email address');
	});

	it('announces the error via an alert live region', () => {
		renderInput({ invalidType: 'email', errorMessage: { email: 'Enter a valid email address' } });
		expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address');
	});

	it('is neither invalid nor described when there is no error', () => {
		renderInput();
		const field = expectExposedAs('textbox', 'Email');
		expect(field).not.toHaveAttribute('aria-invalid');
		expect(field).not.toHaveAttribute('aria-describedby');
	});
});
