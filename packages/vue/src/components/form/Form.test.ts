import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ref, nextTick } from 'vue';
import { Form } from '.';

const {
	Root: FormRoot,
	Field: FormField,
	Label: FormLabel,
	Control: FormControl,
	Description: FormDescription,
	Error: FormError,
} = Form;

function renderForm(invalid = false) {
	return render({
		template: `
			<FormRoot data-testid="form">
				<FormField name="email" :invalid="invalid">
					<FormLabel>Email</FormLabel>
					<FormControl>
						<input type="email" />
					</FormControl>
					<FormDescription>We'll never share it</FormDescription>
					<FormError>Invalid email</FormError>
				</FormField>
			</FormRoot>
		`,
		components: {
			FormRoot,
			FormField,
			FormLabel,
			FormControl,
			FormDescription,
			FormError,
		},
		setup() {
			return { invalid };
		},
	});
}

describe('Form', () => {
	it('Label is associated with the Control via for/id', () => {
		renderForm();
		const input = screen.getByRole('textbox', { name: 'Email' });
		const id = input.getAttribute('id');
		expect(id).toBeTruthy();
		expect(screen.getByText('Email').getAttribute('for')).toBe(id);
	});

	it('Description is wired via aria-describedby', async () => {
		renderForm();
		await nextTick();
		const input = screen.getByRole('textbox');
		const desc = screen.getByText("We'll never share it");
		const describedBy = (input.getAttribute('aria-describedby') || '').split(' ');
		expect(describedBy).toContain(desc.getAttribute('id'));
	});

	it('Error is hidden by default and visible only when invalid', async () => {
		const invalid = ref(false);
		render({
			template: `
				<FormRoot>
					<FormField name="email" :invalid="invalid">
						<FormLabel>Email</FormLabel>
						<FormControl>
							<input type="email" />
						</FormControl>
						<FormError>Invalid email</FormError>
					</FormField>
				</FormRoot>
			`,
			components: { FormRoot, FormField, FormLabel, FormControl, FormError },
			setup() {
				return { invalid };
			},
		});
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		invalid.value = true;
		await nextTick();
		expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
	});

	it('aria-invalid + data-invalid propagate to control when invalid', () => {
		renderForm(true);
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('data-invalid', '');
	});

	it('disabled Field disables the control', () => {
		render({
			template: `
				<FormRoot>
					<FormField name="email" :disabled="true">
						<FormLabel>Email</FormLabel>
						<FormControl>
							<input type="email" />
						</FormControl>
					</FormField>
				</FormRoot>
			`,
			components: { FormRoot, FormField, FormLabel, FormControl },
		});
		expect(screen.getByRole('textbox')).toBeDisabled();
	});
});
