import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Textarea } from './Textarea';

function renderTextarea(rootProps: Omit<ComponentProps<typeof Textarea.Root>, 'children'> = {}) {
	return render(() => (
		<Textarea.Root {...rootProps}>
			<Textarea.Label>Message</Textarea.Label>
			<Textarea.Field placeholder='Enter message' />
			<Textarea.Error />
		</Textarea.Root>
	));
}

describe('Textarea', () => {
	it('renders label and textarea', () => {
		renderTextarea();
		expect(screen.getByText('Message')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
	});

	it('label links to textarea via htmlFor', () => {
		renderTextarea({ id: 'msg' });
		expect(screen.getByLabelText('Message')).toBeInTheDocument();
	});

	it('uncontrolled: typing updates value', async () => {
		renderTextarea();
		const ta = screen.getByPlaceholderText('Enter message');
		await userEvent.type(ta, 'hello world');
		expect(ta).toHaveValue('hello world');
	});

	it('controlled: value prop controls the textarea', () => {
		renderTextarea({ value: 'initial value', onChange: vi.fn() });
		expect(screen.getByPlaceholderText('Enter message')).toHaveValue('initial value');
	});

	it('onChange fires on keystroke', async () => {
		const handleChange = vi.fn();
		renderTextarea({ onChange: handleChange });
		await userEvent.type(screen.getByPlaceholderText('Enter message'), 'hi');
		expect(handleChange).toHaveBeenCalledTimes(2);
		expect(handleChange).toHaveBeenLastCalledWith('hi');
	});

	it('data-active is set on focus', async () => {
		renderTextarea();
		const ta = screen.getByPlaceholderText('Enter message');
		await userEvent.click(ta);
		expect(ta).toHaveAttribute('data-active', '');
	});

	it('data-active is cleared on blur', async () => {
		renderTextarea();
		const ta = screen.getByPlaceholderText('Enter message');
		await userEvent.click(ta);
		await userEvent.tab();
		expect(ta).not.toHaveAttribute('data-active');
	});

	it('required: shows * in label', () => {
		renderTextarea({ isRequired: true });
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('shows error when invalidType is set by consumer', () => {
		renderTextarea({ invalidType: 'required', errorMessage: { required: 'Message is required' } });
		expect(screen.getByRole('alert')).toHaveTextContent('Message is required');
		expect(screen.getByPlaceholderText('Enter message')).toHaveAttribute('data-invalid', '');
		expect(screen.getByPlaceholderText('Enter message')).toHaveAttribute('aria-invalid', 'true');
	});

	it('no error shown when invalidType is not set', () => {
		renderTextarea({ errorMessage: { required: 'Message is required' } });
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('onFocus / onBlur callbacks fire', async () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderTextarea({ onFocus: handleFocus, onBlur: handleBlur });
		const ta = screen.getByPlaceholderText('Enter message');
		await userEvent.click(ta);
		expect(handleFocus).toHaveBeenCalledTimes(1);
		await userEvent.tab();
		expect(handleBlur).toHaveBeenCalledTimes(1);
	});
});
