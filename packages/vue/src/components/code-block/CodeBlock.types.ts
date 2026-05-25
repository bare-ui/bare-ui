// ---------------------------------------------------------------------------
// Lines
// ---------------------------------------------------------------------------

export type CodeBlockDiffType = 'add' | 'remove';

export interface CodeBlockLine {
	/** 1-based display line number (offset by `startLine`). */
	number: number;
	/** Raw text content of the line (no trailing newline). */
	content: string;
	/** Diff marker for this line, if any. */
	diff?: CodeBlockDiffType;
	/** Whether this line is in `highlightLines`. */
	highlighted: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CodeBlockContextValue {
	code: string;
	language?: string;
	lines: CodeBlockLine[];
	copied: boolean;
	copy: () => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface CodeBlockRootProps {
	/** The source code to display. */
	code: string;
	/** Language label, surfaced as `data-language` and on the context. */
	language?: string;
	/**
	 * Diff markers keyed by 1-based line number → `'add'` or `'remove'`.
	 * @example { 2: 'remove', 3: 'add' }
	 */
	diff?: Record<number, CodeBlockDiffType>;
	/** 1-based line numbers to mark as highlighted. */
	highlightLines?: number[];
	/** Number the first line starts at. Default `1`. */
	startLine?: number;
	/** ms before the copied state resets. Default `2000`. */
	copyResetAfter?: number;
	/** Additional CSS class. */
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface CodeBlockCodeProps {
	class?: string;
}

export interface CodeBlockLinesProps {
	// no public props — uses scoped slot { line: CodeBlockLine }
	class?: string;
}

export interface CodeBlockCopyButtonProps {
	class?: string;
}
