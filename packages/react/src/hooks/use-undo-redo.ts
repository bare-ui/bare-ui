import { useCallback, useMemo, useState } from 'react';

export interface UseUndoRedoOptions {
	/** Maximum entries to keep in the past stack. Defaults to 100. Set to `Infinity` for unlimited. */
	limit?: number;
}

export interface UseUndoRedoResult<T> {
	/** Current value. */
	value: T;
	/** Replace the current value, pushing the previous onto the undo stack. */
	set: (next: T | ((prev: T) => T)) => void;
	/** Step back to the previous value. No-op if `canUndo` is `false`. */
	undo: () => void;
	/** Re-apply a value that was undone. No-op if `canRedo` is `false`. */
	redo: () => void;
	/** Reset history to `initialValue` (clears past + future). */
	reset: (next?: T) => void;
	/** Clear history without changing the current value. */
	clear: () => void;
	canUndo: boolean;
	canRedo: boolean;
	/** Number of entries that can be undone. */
	pastSize: number;
	/** Number of entries that can be redone. */
	futureSize: number;
}

interface History<T> {
	past: T[];
	present: T;
	future: T[];
}

/**
 * Tracks a value with bounded undo/redo history.
 *
 * `set` pushes the current value onto the past stack and clears the redo stack
 * (standard editor behaviour). `undo` / `redo` step backwards / forwards.
 *
 * @example
 * const { value, set, undo, redo, canUndo } = useUndoRedo('')
 */
export function useUndoRedo<T>(initialValue: T, options: UseUndoRedoOptions = {}): UseUndoRedoResult<T> {
	const { limit = 100 } = options;
	const [history, setHistory] = useState<History<T>>({
		past: [],
		present: initialValue,
		future: [],
	});

	const set = useCallback(
		(next: T | ((prev: T) => T)) => {
			setHistory((h) => {
				const resolved = typeof next === 'function' ? (next as (prev: T) => T)(h.present) : next;
				if (Object.is(resolved, h.present)) return h;
				const past = limit === Infinity ? [...h.past, h.present] : [...h.past, h.present].slice(-limit);
				return { past, present: resolved, future: [] };
			});
		},
		[limit],
	);

	const undo = useCallback(() => {
		setHistory((h) => {
			if (h.past.length === 0) return h;
			const previous = h.past[h.past.length - 1]!;
			return {
				past: h.past.slice(0, -1),
				present: previous,
				future: [h.present, ...h.future],
			};
		});
	}, []);

	const redo = useCallback(() => {
		setHistory((h) => {
			if (h.future.length === 0) return h;
			const next = h.future[0]!;
			return {
				past: [...h.past, h.present],
				present: next,
				future: h.future.slice(1),
			};
		});
	}, []);

	const reset = useCallback(
		(next?: T) => {
			setHistory({ past: [], present: next === undefined ? initialValue : next, future: [] });
		},
		[initialValue],
	);

	const clear = useCallback(() => {
		setHistory((h) => ({ past: [], present: h.present, future: [] }));
	}, []);

	return useMemo(
		() => ({
			value: history.present,
			set,
			undo,
			redo,
			reset,
			clear,
			canUndo: history.past.length > 0,
			canRedo: history.future.length > 0,
			pastSize: history.past.length,
			futureSize: history.future.length,
		}),
		[history, set, undo, redo, reset, clear],
	);
}
