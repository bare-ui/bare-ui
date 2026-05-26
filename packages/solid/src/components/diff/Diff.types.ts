import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Diff model
// ---------------------------------------------------------------------------

export type DiffLineType = 'equal' | 'insert' | 'delete';

export interface DiffLine {
	type: DiffLineType;
	/** Line text (no trailing newline). */
	content: string;
	/** 1-based line number in the old text (absent for inserts). */
	oldLine?: number;
	/** 1-based line number in the new text (absent for deletes). */
	newLine?: number;
}

/** A side-by-side row. A modified line pairs a delete (left) with an insert (right). */
export interface DiffRow {
	left?: DiffLine;
	right?: DiffLine;
}

export interface DiffStats {
	additions: number;
	deletions: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface DiffContextValue {
	readonly lines: DiffLine[];
	readonly rows: DiffRow[];
	readonly stats: DiffStats;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface DiffRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The original ("before") text. */
	oldValue: string;
	/** The updated ("after") text. */
	newValue: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface DiffUnifiedProps {
	/** Render a single unified line. */
	children: (props: { line: DiffLine }) => JSX.Element;
}

export interface DiffSplitProps {
	/** Render a single side-by-side row. */
	children: (props: DiffRow) => JSX.Element;
}

export interface DiffStatsProps {
	/** Render the additions/deletions summary. */
	children: (props: DiffStats) => JSX.Element;
}
