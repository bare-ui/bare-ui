import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { Input } from '.';

const { Root: InputRoot, Field: InputField, Label: InputLabel, Error: InputError } = Input;

function renderInput(rootProps: Record<string, unknown> = {}, fieldProps: Record<string, unknown> = {}) {
	return render({
		template: `
			<InputRoot v-bind="rootProps">
				<InputLabel>Email</InputLabel>
				<InputField placeholder="Enter email" v-bind="fieldProps" />
				<InputError />
			</InputRoot>
		`,
		components: { InputRoot, InputField, InputLabel, InputError },
		setup() {
			return { rootProps, fieldProps };
		},
	});
}

describe('Input — screen reader semantics', () => {
	it('is exposed as a textbox named by its label', () => {
		renderInput();
		const field = expectExposedAs('textbox', 'Email');
		expect(field).toBe(screen.getByPlaceholderText('Enter email'));
	});

	it('exposes the required state to assistive tech', () => {
		renderInput({ isRequired: true });
		// The required marker `*` is prepended by InputLabel when isRequired is true,
		// so the computed accessible name becomes "*Email".
		const field = expectExposedAs('textbox', '*Email');
		expect(field).toHaveAttribute('aria-required', 'true');
		expect(field).toBeRequired();
	});

	it('does not announce required when not required', () => {
		renderInput();
		expect(expectExposedAs('textbox', 'Email')).not.toHaveAttribute('aria-required');
	});

	it('marks the field invalid when errored', () => {
		renderInput({ invalidType: 'email', errorMessage: { email: 'Enter a valid email address' } });
		const field = expectExposedAs('textbox', 'Email');
		expect(field).toHaveAttribute('aria-invalid', 'true');
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
