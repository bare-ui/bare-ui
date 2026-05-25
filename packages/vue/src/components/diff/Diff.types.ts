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
	lines: DiffLine[];
	rows: DiffRow[];
	stats: DiffStats;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface DiffRootProps {
	/** The original ("before") text. */
	oldValue: string;
	/** The updated ("after") text. */
	newValue: string;
	/** Optional CSS class (forwarded via fallthrough). */
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface DiffUnifiedProps {
	class?: string;
}

export interface DiffSplitProps {
	class?: string;
}

export interface DiffStatsProps {
	class?: string;
}
