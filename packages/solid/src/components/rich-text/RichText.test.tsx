import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { RichText } from './RichText';

function renderEditor(props: Partial<ComponentProps<typeof RichText.Root>> = {}) {
	return render(() => (
		<RichText.Root {...props}>
			<RichText.Toolbar>
				<RichText.Action
					wrap='**'
					aria-label='bold'>
					B
				</RichText.Action>
				<RichText.Action
					wrap={['[', '](url)']}
					aria-label='link'>
					Link
				</RichText.Action>
				<RichText.Action
					insert={'\n- '}
					aria-label='list'>
					List
				</RichText.Action>
			</RichText.Toolbar>
			<RichText.Editor aria-label='editor' />
			<RichText.Preview data-testid='preview' />
		</RichText.Root>
	));
}

describe('RichText', () => {
	it('binds the editor to the value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderEditor({ onChange });
		const editor = screen.getByLabelText('editor') as HTMLTextAreaElement;
		await user.type(editor, 'hello');
		expect(editor.value).toBe('hello');
		expect(onChange).toHaveBeenLastCalledWith('hello');
	});

	it('wraps the selection with a symmetric token', async () => {
		const user = userEvent.setup();
		renderEditor({ defaultValue: 'hello' });
		const editor = screen.getByLabelText('editor') as HTMLTextAreaElement;
		editor.focus();
		editor.setSelectionRange(0, 5);
		await user.click(screen.getByLabelText('bold'));
		expect(editor.value).toBe('**hello**');
	});

	it('wraps with an asymmetric token pair', async () => {
		const user = userEvent.setup();
		renderEditor({ defaultValue: 'text' });
		const editor = screen.getByLabelText('editor') as HTMLTextAreaElement;
		editor.focus();
		editor.setSelectionRange(0, 4);
		await user.click(screen.getByLabelText('link'));
		expect(editor.value).toBe('[text](url)');
	});

	it('inserts text at the caret', async () => {
		const user = userEvent.setup();
		renderEditor({ defaultValue: 'item' });
		const editor = screen.getByLabelText('editor') as HTMLTextAreaElement;
		editor.focus();
		editor.setSelectionRange(4, 4);
		await user.click(screen.getByLabelText('list'));
		expect(editor.value).toBe('item\n- ');
	});

	it('hides the preview in edit mode', () => {
		renderEditor({ defaultMode: 'edit', defaultValue: 'hi' });
		expect(screen.getByLabelText('editor')).toBeInTheDocument();
		expect(screen.queryByTestId('preview')).toBeNull();
	});

	it('hides the editor and renders Markdown in preview mode', () => {
		renderEditor({ defaultMode: 'preview', defaultValue: 'rendered text' });
		expect(screen.queryByLabelText('editor')).toBeNull();
		expect(screen.getByTestId('preview')).toHaveTextContent('rendered text');
	});

	it('shows both panes in split mode', () => {
		renderEditor({ defaultMode: 'split', defaultValue: 'hi' });
		expect(screen.getByLabelText('editor')).toBeInTheDocument();
		expect(screen.getByTestId('preview')).toBeInTheDocument();
	});

	it('uses a custom parser for the preview', () => {
		renderEditor({
			defaultMode: 'preview',
			defaultValue: 'shout',
			parse: (src) => [{ type: 'heading', depth: 1, children: [{ type: 'text', value: src.toUpperCase() }] }],
		});
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SHOUT');
	});

	it('throws when Editor is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <RichText.Editor />)).toThrow(/RichText.Root/);
		spy.mockRestore();
	});
});
