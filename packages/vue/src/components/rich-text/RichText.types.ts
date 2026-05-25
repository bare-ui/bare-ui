import type { MarkdownComponents, MarkdownNode } from '../markdown/Markdown.types';

export type RichTextMode = 'edit' | 'preview' | 'split';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface RichTextContextValue {
	value: string;
	setValue: (value: string) => void;
	mode: RichTextMode;
	setMode: (mode: RichTextMode) => void;
	editorEl: HTMLTextAreaElement | null;
	setEditorEl: (el: HTMLTextAreaElement | null) => void;
	/** Wrap the current selection with `before` / `after` (defaults `after` to `before`). */
	wrapSelection: (before: string, after?: string) => void;
	/** Insert text at the caret. */
	insert: (text: string) => void;
	parse?: (content: string) => MarkdownNode[];
	components?: MarkdownComponents;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface RichTextRootProps {
	/** Controlled Markdown source. */
	value?: string;
	/** Initial Markdown source (uncontrolled). */
	defaultValue?: string;
	/** Called when the source changes. */
	onChange?: (value: string) => void;
	/** Controlled view mode. */
	mode?: RichTextMode;
	/** Initial view mode (uncontrolled). Default `'edit'`. */
	defaultMode?: RichTextMode;
	/** Called when the view mode changes. */
	onModeChange?: (mode: RichTextMode) => void;
	/** Parser used by `Preview` (wrap `remark`/`marked`). */
	parse?: (content: string) => MarkdownNode[];
	/** Render-part overrides forwarded to the `Markdown` preview. */
	components?: MarkdownComponents;
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface RichTextToolbarProps {
	class?: string;
}

export interface RichTextActionProps {
	/** Wrap the selection. Pass a single string (used for both sides) or `[before, after]`. */
	wrap?: string | [string, string];
	/** Insert text at the caret. */
	insert?: string;
	class?: string;
}

export interface RichTextEditorProps {
	class?: string;
}

export interface RichTextPreviewProps {
	class?: string;
}
