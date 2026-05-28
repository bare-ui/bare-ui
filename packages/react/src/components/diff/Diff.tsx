import React, { createContext, useContext, useMemo } from 'react';
import type {
	DiffContextValue,
	DiffLine,
	DiffRootProps,
	DiffRow,
	DiffSplitProps,
	DiffStatsProps,
	DiffUnifiedProps,
} from './Diff.types';

// ---------------------------------------------------------------------------
// Diff algorithm (LCS, line granularity)
// ---------------------------------------------------------------------------

function splitLines(s: string): string[] {
	if (s === '') return [];
	const arr = s.split('\n');
	if (arr.length > 1 && arr[arr.length - 1] === '') arr.pop();
	return arr;
}

function diffLines(oldStr: string, newStr: string): DiffLine[] {
	const a = splitLines(oldStr);
	const b = splitLines(newStr);
	const m = a.length;
	const n = b.length;

	// LCS length table; dp[i][j] = LCS of a[i:] and b[j:].
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
	for (let i = m - 1; i >= 0; i--) {
		for (let j = n - 1; j >= 0; j--) {
			dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}

	const lines: DiffLine[] = [];
	let i = 0;
	let j = 0;
	let oldNo = 1;
	let newNo = 1;
	while (i < m && j < n) {
		if (a[i] === b[j]) {
			lines.push({ type: 'equal', content: a[i], oldLine: oldNo++, newLine: newNo++ });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			lines.push({ type: 'delete', content: a[i], oldLine: oldNo++ });
			i++;
		} else {
			lines.push({ type: 'insert', content: b[j], newLine: newNo++ });
			j++;
		}
	}
	while (i < m) lines.push({ type: 'delete', content: a[i++], oldLine: oldNo++ });
	while (j < n) lines.push({ type: 'insert', content: b[j++], newLine: newNo++ });
	return lines;
}

/** Pairs runs of deletes/inserts into side-by-side rows. */
function buildRows(lines: DiffLine[]): DiffRow[] {
	const rows: DiffRow[] = [];
	let deletes: DiffLine[] = [];
	let inserts: DiffLine[] = [];

	const flush = () => {
		const max = Math.max(deletes.length, inserts.length);
		for (let k = 0; k < max; k++) rows.push({ left: deletes[k], right: inserts[k] });
		deletes = [];
		inserts = [];
	};

	for (const line of lines) {
		if (line.type === 'equal') {
			flush();
			rows.push({ left: line, right: line });
		} else if (line.type === 'delete') {
			deletes.push(line);
		} else {
			inserts.push(line);
		}
	}
	flush();
	return rows;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DiffContext = createContext<DiffContextValue | null>(null);

function useDiffContext() {
	const ctx = useContext(DiffContext);
	if (!ctx) throw new globalThis.Error('Diff sub-components must be used within Diff.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, DiffRootProps>(
	({ oldValue, newValue, className, children, ...rest }, ref) => {
		const ctx = useMemo<DiffContextValue>(() => {
			const lines = diffLines(oldValue, newValue);
			const rows = buildRows(lines);
			const stats = {
				additions: lines.filter((l) => l.type === 'insert').length,
				deletions: lines.filter((l) => l.type === 'delete').length,
			};
			return { lines, rows, stats };
		}, [oldValue, newValue]);

		return (
			<DiffContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</DiffContext.Provider>
		);
	},
);

Root.displayName = 'Diff.Root';

// ---------------------------------------------------------------------------
// Unified
// ---------------------------------------------------------------------------

const Unified: React.FC<DiffUnifiedProps> = ({ children }) => {
	const ctx = useDiffContext();
	return (
		<div data-diff-view='unified'>
			{ctx.lines.map((line, i) => (
				<div
					key={i}
					data-diff-line=''
					data-type={line.type}>
					{children({ line })}
				</div>
			))}
		</div>
	);
};

Unified.displayName = 'Diff.Unified';

// ---------------------------------------------------------------------------
// Split
// ---------------------------------------------------------------------------

const Split: React.FC<DiffSplitProps> = ({ children }) => {
	const ctx = useDiffContext();
	return (
		<div data-diff-view='split'>
			{ctx.rows.map((row, i) => (
				<div
					key={i}
					data-diff-row=''
					data-left={row.left?.type}
					data-right={row.right?.type}>
					{children(row)}
				</div>
			))}
		</div>
	);
};

Split.displayName = 'Diff.Split';

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

const Stats: React.FC<DiffStatsProps> = ({ children }) => {
	const ctx = useDiffContext();
	return <>{children(ctx.stats)}</>;
};

Stats.displayName = 'Diff.Stats';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Diff = {
	Root,
	Unified,
	Split,
	Stats,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Diff.*`).
export { Root, Unified, Split, Stats };
