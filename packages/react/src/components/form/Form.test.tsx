import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from './Form';

function renderForm(invalid = false) {
	return render(
		<Form.Root data-testid='form'>
			<Form.Field name='email' invalid={invalid}>
				<Form.Label>Email</Form.Label>
				<Form.Control>
					<input type='email' />
				</Form.Control>
				<Form.Description>We'll never share it</Form.Description>
				<Form.Error>Invalid email</Form.Error>
			</Form.Field>
		</Form.Root>,
	);
}

describe('Form', () => {
	it('Label is associated with the Control via htmlFor/id', () => {
		renderForm();
		const input = screen.getByRole('textbox', { name: 'Email' });
		const id = input.getAttribute('id');
		expect(id).toBeTruthy();
		expect(screen.getByText('Email').getAttribute('for')).toBe(id);
	});

	it('Description is wired via aria-describedby', () => {
		renderForm();
		const input = screen.getByRole('textbox');
		const desc = screen.getByText("We'll never share it");
		const describedBy = (input.getAttribute('aria-describedby') || '').split(' ');
		expect(describedBy).toContain(desc.getAttribute('id'));
	});

	it('Error is hidden by default and visible only when invalid', () => {
		const { rerender } = renderForm(false);
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		rerender(
			<Form.Root>
				<Form.Field name='email' invalid>
					<Form.Label>Email</Form.Label>
					<Form.Control>
						<input type='email' />
					</Form.Control>
					<Form.Error>Invalid email</Form.Error>
				</Form.Field>
			</Form.Root>,
		);
		expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
	});

	it('aria-invalid + data-invalid propagate to control when invalid', () => {
		renderForm(true);
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('data-invalid', '');
	});

	it('disabled Field disables the control', () => {
		render(
			<Form.Root>
				<Form.Field name='email' disabled>
					<Form.Label>Email</Form.Label>
					<Form.Control>
						<input type='email' />
					</Form.Control>
				</Form.Field>
			</Form.Root>,
		);
		expect(screen.getByRole('textbox')).toBeDisabled();
	});
});
