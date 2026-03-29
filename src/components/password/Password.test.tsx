import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Password } from './Password';

function renderPassword(rootProps: Omit<React.ComponentProps<typeof Password.Root>, 'children'> = {}) {
	return render(
		<Password.Root {...rootProps}>
			<Password.Label>Password</Password.Label>
			<Password.Field placeholder='Enter password' />
			<Password.Toggle>Toggle</Password.Toggle>
			<Password.Error />
		</Password.Root>,
	);
}

describe('Password', () => {
	it('renders label and field', () => {
		renderPassword();
		expect(screen.getByText('Password')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
	});

	it('label links to input via htmlFor', () => {
		renderPassword({ id: 'pw' });
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
	});

	it('field type is "password" by default', () => {
		renderPassword();
		expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password');
	});

	it('clicking Toggle changes field type to "text"', async () => {
		renderPassword();
		await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
		expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'text');
	});

	it('clicking Toggle again changes field back to "password"', async () => {
		renderPassword();
		await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
		await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
		expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password');
	});

	it('Toggle aria-label changes based on visibility', async () => {
		renderPassword();
		expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
		expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
	});

	it('uncontrolled: typing updates value', async () => {
		renderPassword();
		await userEvent.type(screen.getByPlaceholderText('Enter password'), 'mypassword');
		expect(screen.getByPlaceholderText('Enter password')).toHaveValue('mypassword');
	});

	it('onChange fires on keystroke', async () => {
		const handleChange = vi.fn();
		renderPassword({ onChange: handleChange });
		await userEvent.type(screen.getByPlaceholderText('Enter password'), 'abc');
		expect(handleChange).toHaveBeenCalledTimes(3);
		expect(handleChange).toHaveBeenLastCalledWith('abc');
	});

	it('controlled: value prop controls field', () => {
		renderPassword({ value: 'secret', onChange: vi.fn() });
		expect(screen.getByPlaceholderText('Enter password')).toHaveValue('secret');
	});

	it('required: shows * in label', () => {
		renderPassword({ isRequired: true });
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('required: shows error on blur when empty', async () => {
		renderPassword({
			isRequired: true,
			errorMessage: { required: 'Password is required' },
		});
		const field = screen.getByPlaceholderText('Enter password');
		await userEvent.click(field);
		await userEvent.tab();
		expect(screen.getByRole('alert')).toHaveTextContent('Password is required');
		expect(field).toHaveAttribute('data-invalid', '');
	});

	it('no error when not required and left empty', async () => {
		renderPassword();
		await userEvent.click(screen.getByPlaceholderText('Enter password'));
		await userEvent.tab();
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('Toggle data-visible attribute is present when visible', async () => {
		renderPassword();
		const toggle = screen.getByRole('button', { name: 'Show password' });
		expect(toggle).not.toHaveAttribute('data-visible');
		await userEvent.click(toggle);
		expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('data-visible', '');
	});
});
