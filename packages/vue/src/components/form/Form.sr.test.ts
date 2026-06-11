/**
 * Screen-reader semantics for Form. The field wires a control to its label,
 * description, and error so a screen reader announces the name, required and
 * invalid states, and reads the hint + error as the control's description.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ref, nextTick } from 'vue';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { Form } from '.';

const {
	Root: FormRoot,
	Field: FormField,
	Label: FormLabel,
	Control: FormControl,
	Description: FormDescription,
	Error: FormError,
} = Form;

function renderForm(props: { invalid?: boolean; required?: boolean } = {}) {
	return render({
		template: `
			<FormRoot>
				<FormField name="email" :invalid="invalid" :required="required">
					<FormLabel>Email</FormLabel>
					<FormControl>
						<input type="email" />
					</FormControl>
					<FormDescription>We'll never share it</FormDescription>
					<FormError>Enter a valid email</FormError>
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
			return {
				invalid: props.invalid ?? false,
				required: props.required ?? false,
			};
		},
	});
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

	it('reads the description as the control accessible description', async () => {
		renderForm();
		await nextTick();
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription("We'll never share it");
	});

	it('marks the field invalid and folds the error into the accessible description', async () => {
		renderForm({ invalid: true });
		await nextTick();
		const input = screen.getByRole('textbox', { name: 'Email' });
		expect(input).toHaveAttribute('aria-invalid', 'true');
		// SR reads both the hint and the error message as the field's description.
		expect(input).toHaveAccessibleDescription("We'll never share it Enter a valid email");
	});

	it('announces the error through a live region when the field becomes invalid', async () => {
		const invalid = ref(false);

		render({
			template: `
				<FormRoot>
					<FormField name="email" :invalid="invalid">
						<FormLabel>Email</FormLabel>
						<FormControl>
							<input type="email" />
						</FormControl>
						<FormError>Enter a valid email</FormError>
					</FormField>
				</FormRoot>
			`,
			components: {
				FormRoot,
				FormField,
				FormLabel,
				FormControl,
				FormError,
			},
			setup() {
				return { invalid };
			},
		});

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();

		invalid.value = true;
		await nextTick();

		expectExposedAs('alert');
		expectAnnounced('Enter a valid email');
	});
});