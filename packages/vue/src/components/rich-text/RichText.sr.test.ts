/**
 * Screen-reader semantics for RichText. The editor is a multiline text field —
 * SR must announce it as a named textbox that accepts multiple lines — and the
 * formatting controls live in a labelled toolbar with named buttons. In preview
 * mode the rendered Markdown exposes real semantic structure.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { RichText } from '.';

const {
	Root: RichTextRoot,
	Toolbar: RichTextToolbar,
	Action: RichTextAction,
	Editor: RichTextEditor,
	Preview: RichTextPreview,
} = RichText;

function renderEditor(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<RichTextRoot v-bind="rootProps">
				<RichTextToolbar aria-label="Formatting">
					<RichTextAction wrap="**" aria-label="Bold">B</RichTextAction>
					<RichTextAction insert="\n- " aria-label="List">List</RichTextAction>
				</RichTextToolbar>
				<RichTextEditor aria-label="Message body" />
				<RichTextPreview data-testid="preview" />
			</RichTextRoot>
		`,
		components: {
			RichTextRoot,
			RichTextToolbar,
			RichTextAction,
			RichTextEditor,
			RichTextPreview,
		},
		setup() {
			return { rootProps: props };
		},
	});
}

describe('RichText — screen reader semantics', () => {
	it('exposes the editor as a named, multiline textbox', () => {
		renderEditor();
		const editor = expectExposedAs('textbox', 'Message body');
		// A native <textarea> is implicitly aria-multiline; SR announces
		// "Message body, edit text, multiple lines" without an explicit attribute.
		expect(editor.tagName).toBe('TEXTAREA');
	});

	it('exposes the formatting controls inside a labelled toolbar', () => {
		renderEditor();
		const toolbar = expectExposedAs('toolbar', 'Formatting');
		expectExposedAs('button', 'Bold', {}, toolbar);
		expectExposedAs('button', 'List', {}, toolbar);
	});

	it('exposes rendered semantic structure in preview mode', () => {
		renderEditor({
			defaultMode: 'preview',
			defaultValue: 'shout',
			parse: (src: string) => [{ type: 'heading', depth: 1, children: [{ type: 'text', value: src.toUpperCase() }] }],
		});
		// The editor textbox is gone; the preview exposes a real heading.
		expect(screen.queryByRole('textbox')).toBeNull();
		expectExposedAs('heading', 'SHOUT', { level: 1 });
	});
});
