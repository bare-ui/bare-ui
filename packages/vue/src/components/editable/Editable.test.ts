import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Editable } from '.';

function renderEditable(props: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(
					Editable.Root,
					{
						defaultValue: 'Hello',
						placeholder: 'Empty',
						...props,
					},
					() => [
						h(Editable.Preview, { 'data-testid': 'preview' }),
						h(Editable.Input, { 'aria-label': 'field' }),
						h(Editable.SubmitTrigger, null, () => 'save'),
						h(Editable.CancelTrigger, null, () => 'cancel'),
					],
				);
		},
	});
}

describe('Editable', () => {
	it('shows the value in preview and no input initially', () => {
		renderEditable();
		expect(screen.getByTestId('preview')).toHaveTextContent('Hello');
		expect(screen.queryByLabelText('field')).toBeNull();
	});

	it('enters edit mode on preview click and focuses the input', async () => {
		const user = userEvent.setup();
		renderEditable();
		await user.click(screen.getByTestId('preview'));
		const input = screen.getByLabelText('field') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('Hello');
		expect(input).toHaveFocus();
	});

	it('commits on Enter and updates the preview', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderEditable({ onSubmit });
		await user.click(screen.getByTestId('preview'));
		const input = screen.getByLabelText('field');
		await user.clear(input);
		await user.type(input, 'World');
		await user.keyboard('{Enter}');
		expect(onSubmit).toHaveBeenCalledWith('World');
		expect(screen.getByTestId('preview')).toHaveTextContent('World');
		expect(screen.queryByLabelText('field')).toBeNull();
	});

	it('discards on Escape', async () => {
		const user = userEvent.setup();
		const onCancel = vi.fn();
		renderEditable({ onCancel, submitOnBlur: false });
		await user.click(screen.getByTestId('preview'));
		const input = screen.getByLabelText('field');
		await user.clear(input);
		await user.type(input, 'changed');
		await user.keyboard('{Escape}');
		expect(onCancel).toHaveBeenCalled();
		expect(screen.getByTestId('preview')).toHaveTextContent('Hello');
	});

	it('commits on blur when submitOnBlur is true', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderEditable({ onSubmit });
		await user.click(screen.getByTestId('preview'));
		const input = screen.getByLabelText('field');
		await user.clear(input);
		await user.type(input, 'Blurred');
		fireEvent.blur(input);
		expect(onSubmit).toHaveBeenCalledWith('Blurred');
	});

	it('does not commit on blur when submitOnBlur is false', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderEditable({ onSubmit, submitOnBlur: false });
		await user.click(screen.getByTestId('preview'));
		const input = screen.getByLabelText('field');
		await user.type(input, '!');
		fireEvent.blur(input);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('commits via SubmitTrigger', async () => {
		const user = userEvent.setup();
		renderEditable({ submitOnBlur: false });
		await user.click(screen.getByTestId('preview'));
		await user.clear(screen.getByLabelText('field'));
		await user.type(screen.getByLabelText('field'), 'Saved');
		await user.click(screen.getByText('save'));
		expect(screen.getByTestId('preview')).toHaveTextContent('Saved');
	});

	it('shows the placeholder when empty', () => {
		renderEditable({ defaultValue: '' });
		const preview = screen.getByTestId('preview');
		expect(preview).toHaveTextContent('Empty');
		expect(preview).toHaveAttribute('data-empty', '');
	});

	it('does not enter edit mode when disabled', async () => {
		const user = userEvent.setup();
		renderEditable({ disabled: true });
		await user.click(screen.getByTestId('preview'));
		expect(screen.queryByLabelText('field')).toBeNull();
	});

	it('throws when Preview is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(Editable.Preview);
				},
			}),
		).toThrow(/Editable.Root/);
		spy.mockRestore();
	});
});
