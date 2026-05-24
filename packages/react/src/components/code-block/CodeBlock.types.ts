import React from 'react';

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

export interface CodeBlockRootProps extends React.HTMLAttributes<HTMLDivElement> {
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
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type CodeBlockCodeProps = React.HTMLAttributes<HTMLPreElement>;

export interface CodeBlockLinesProps {
	/**
	 * Render a single line. The wrapping element (with `data-*` attributes) is
	 * provided for you — bring your own syntax highlighting for `line.content`.
	 */
	children: (props: { line: CodeBlockLine }) => React.ReactNode;
}

export interface CodeBlockCopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	/** Static content, or a render function receiving the copied state. */
	children?: React.ReactNode | ((props: { copied: boolean }) => React.ReactNode);
}
