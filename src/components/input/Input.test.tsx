import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

function renderInput(
	rootProps: Omit<React.ComponentProps<typeof Input.Root>, 'children'> = {},
	fieldProps: React.ComponentProps<typeof Input.Field> = {},
) {
	return render(
		<Input.Root {...rootProps}>
			<Input.Label>Email</Input.Label>
			<Input.Field
				placeholder='Enter email'
				{...fieldProps}
			/>
			<Input.Error />
		</Input.Root>,
	);
}

describe('Input', () => {
	it('renders label and field', () => {
		renderInput();
		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
	});

	it('label htmlFor links to input id', () => {
		renderInput({ id: 'test-input' });
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	it('uncontrolled: typing updates value', async () => {
		renderInput();
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.type(input, 'hello');
		expect(input).toHaveValue('hello');
	});

	it('controlled: value prop controls the field', () => {
		renderInput({ value: 'test@example.com', onChange: vi.fn() });
		expect(screen.getByPlaceholderText('Enter email')).toHaveValue('test@example.com');
	});

	it('onChange fires on every keystroke', async () => {
		const handleChange = vi.fn();
		renderInput({ onChange: handleChange });
		await userEvent.type(screen.getByPlaceholderText('Enter email'), 'abc');
		expect(handleChange).toHaveBeenCalledTimes(3);
		expect(handleChange).toHaveBeenLastCalledWith('abc');
	});

	it('data-active is set on focus', async () => {
		renderInput();
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.click(input);
		expect(input).toHaveAttribute('data-active', '');
	});

	it('required: shows * in label when isRequired=true', () => {
		renderInput({ isRequired: true });
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('required: error shows on blur with empty field', async () => {
		renderInput({
			isRequired: true,
			errorMessage: { required: 'This field is required' },
		});
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.click(input);
		await userEvent.tab();
		expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
		expect(input).toHaveAttribute('data-invalid', '');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('no error shown when field is not required and left empty', async () => {
		renderInput();
		await userEvent.click(screen.getByPlaceholderText('Enter email'));
		await userEvent.tab();
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('email validation: error on invalid email blur', async () => {
		renderInput({
			validation: 'email',
			errorMessage: { email: 'Invalid email' },
		});
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.type(input, 'not-an-email');
		await userEvent.tab();
		expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
	});

	it('email validation: no error on valid email blur', async () => {
		renderInput({
			validation: 'email',
			errorMessage: { email: 'Invalid email' },
		});
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.type(input, 'user@example.com');
		await userEvent.tab();
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('onFocus / onBlur callbacks fire', async () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderInput({ onFocus: handleFocus, onBlur: handleBlur });
		const input = screen.getByPlaceholderText('Enter email');
		await userEvent.click(input);
		expect(handleFocus).toHaveBeenCalledTimes(1);
		await userEvent.tab();
		expect(handleBlur).toHaveBeenCalledTimes(1);
	});
});
