import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, ref } from 'vue';
import { RichText } from '.';
import type { RichTextMode } from './RichText.types';

function renderEditor(props: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(RichText.Root, props, () => [
					h(RichText.Toolbar, null, () => [
						h(RichText.Action, { wrap: '**', 'aria-label': 'bold' }, () => 'B'),
						h(RichText.Action, { wrap: ['[', '](url)'], 'aria-label': 'link' }, () => 'Link'),
						h(RichText.Action, { insert: '\n- ', 'aria-label': 'list' }, () => 'List'),
					]),
					h(RichText.Editor, { 'aria-label': 'editor' }),
					h(RichText.Preview, { 'data-testid': 'preview' }),
				]);
		},
	});
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

	it('keeps wrapping the selection after toggling through preview mode', async () => {
		const user = userEvent.setup();
		const mode = ref<RichTextMode>('split');
		render({
			setup() {
				return () =>
					h(RichText.Root, { mode: mode.value, defaultValue: 'hello\nworld' }, () => [
						h(RichText.Toolbar, null, () => [
							h(RichText.Action, { wrap: '**', 'aria-label': 'bold' }, () => 'B'),
						]),
						h(RichText.Editor, { 'aria-label': 'editor' }),
						h(RichText.Preview, { 'data-testid': 'preview' }),
					]);
			},
		});
		// The textarea is removed (v-if) in preview, then re-created on the way back.
		mode.value = 'preview';
		await Promise.resolve();
		mode.value = 'split';
		await Promise.resolve();

		const editor = screen.getByLabelText('editor') as HTMLTextAreaElement;
		editor.focus();
		editor.setSelectionRange(0, 5);
		await user.click(screen.getByLabelText('bold'));
		expect(editor.value).toBe('**hello**\nworld');
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

	it('hides the editor and renders content in preview mode', () => {
		renderEditor({ defaultMode: 'preview', defaultValue: 'rendered text' });
		expect(screen.queryByLabelText('editor')).toBeNull();
		expect(screen.getByTestId('preview')).toBeInTheDocument();
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
			parse: (src: string) => [{ type: 'heading', depth: 1, children: [{ type: 'text', value: src.toUpperCase() }] }],
		});
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SHOUT');
	});

	it('renders children into custom preview components', () => {
		renderEditor({
			defaultMode: 'preview',
			defaultValue: 'styled',
			parse: (src: string) => [{ type: 'paragraph', children: [{ type: 'text', value: src }] }],
			components: {
				paragraph: { props: ['node'], template: `<p class="custom"><slot /></p>` },
			},
		});
		const para = screen.getByTestId('preview').querySelector('p.custom');
		expect(para).not.toBeNull();
		expect(para).toHaveTextContent('styled');
	});

	it('throws when Editor is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(RichText.Editor, { 'aria-label': 'editor' });
				},
			}),
		).toThrow(/RichText.Root/);
		spy.mockRestore();
	});

	it('sets data-mode on the root element', () => {
		const { container } = renderEditor({ defaultMode: 'split' });
		expect(container.firstChild).toHaveAttribute('data-mode', 'split');
	});

	it('toolbar has role toolbar', () => {
		renderEditor();
		expect(screen.getByRole('toolbar')).toBeInTheDocument();
	});
});
