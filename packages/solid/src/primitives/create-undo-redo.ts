import { createSignal, type Accessor } from 'solid-js';

export interface CreateUndoRedoOptions {
	/** Maximum entries to keep in the past stack. Defaults to 100. Set to `Infinity` for unlimited. */
	limit?: number;
}

export interface CreateUndoRedoResult<T> {
	/** Reactive accessor for the current value. */
	value: Accessor<T>;
	/** Replace the current value, pushing the previous onto the undo stack. */
	set: (next: T | ((prev: T) => T)) => void;
	/** Step back to the previous value. No-op if `canUndo()` is `false`. */
	undo: () => void;
	/** Re-apply a value that was undone. No-op if `canRedo()` is `false`. */
	redo: () => void;
	/** Reset history to `initialValue` (clears past + future). */
	reset: (next?: T) => void;
	/** Clear history without changing the current value. */
	clear: () => void;
	canUndo: Accessor<boolean>;
	canRedo: Accessor<boolean>;
	/** Reactive accessor — number of entries that can be undone. */
	pastSize: Accessor<number>;
	/** Reactive accessor — number of entries that can be redone. */
	futureSize: Accessor<number>;
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
 * const { value, set, undo, redo, canUndo } = createUndoRedo('')
 */
export function createUndoRedo<T>(initialValue: T, options: CreateUndoRedoOptions = {}): CreateUndoRedoResult<T> {
	const { limit = 100 } = options;
	const [history, setHistory] = createSignal<History<T>>({
		past: [],
		present: initialValue,
		future: [],
	});

	const set = (next: T | ((prev: T) => T)) => {
		setHistory((h) => {
			const resolved = typeof next === 'function' ? (next as (prev: T) => T)(h.present) : next;
			if (Object.is(resolved, h.present)) return h;
			const past = limit === Infinity ? [...h.past, h.present] : [...h.past, h.present].slice(-limit);
			return { past, present: resolved, future: [] };
		});
	};

	const undo = () => {
		setHistory((h) => {
			if (h.past.length === 0) return h;
			const previous = h.past[h.past.length - 1]!;
			return {
				past: h.past.slice(0, -1),
				present: previous,
				future: [h.present, ...h.future],
			};
		});
	};

	const redo = () => {
		setHistory((h) => {
			if (h.future.length === 0) return h;
			const next = h.future[0]!;
			return {
				past: [...h.past, h.present],
				present: next,
				future: h.future.slice(1),
			};
		});
	};

	const reset = (next?: T) => {
		setHistory({ past: [], present: next === undefined ? initialValue : next, future: [] });
	};

	const clear = () => {
		setHistory((h) => ({ past: [], present: h.present, future: [] }));
	};

	return {
		value: () => history().present,
		set,
		undo,
		redo,
		reset,
		clear,
		canUndo: () => history().past.length > 0,
		canRedo: () => history().future.length > 0,
		pastSize: () => history().past.length,
		futureSize: () => history().future.length,
	};
}
