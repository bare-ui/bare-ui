import { computed, ref, type ComputedRef, type Ref } from 'vue';

export interface UseUndoRedoOptions {
	/** Maximum entries to keep in the past stack. Defaults to 100. Set to `Infinity` for unlimited. */
	limit?: number;
}

export interface UseUndoRedoResult<T> {
	/** Current value. */
	value: ComputedRef<T>;
	/** Replace the current value, pushing the previous onto the undo stack. */
	set: (next: T | ((prev: T) => T)) => void;
	/** Step back to the previous value. No-op if `canUndo` is `false`. */
	undo: () => void;
	/** Re-apply a value that was undone. No-op if `canRedo` is `false`. */
	redo: () => void;
	/** Reset history to `initialValue` (or `next`), clearing past + future. */
	reset: (next?: T) => void;
	/** Clear history without changing the current value. */
	clear: () => void;
	canUndo: ComputedRef<boolean>;
	canRedo: ComputedRef<boolean>;
	/** Number of entries that can be undone. */
	pastSize: ComputedRef<number>;
	/** Number of entries that can be redone. */
	futureSize: ComputedRef<number>;
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
	const history = ref<History<T>>({ past: [], present: initialValue, future: [] }) as Ref<History<T>>;

	function set(next: T | ((prev: T) => T)) {
		const h = history.value;
		const resolved = typeof next === 'function' ? (next as (prev: T) => T)(h.present) : next;
		if (Object.is(resolved, h.present)) return;
		const past = limit === Infinity ? [...h.past, h.present] : [...h.past, h.present].slice(-limit);
		history.value = { past, present: resolved, future: [] };
	}

	function undo() {
		const h = history.value;
		if (h.past.length === 0) return;
		const previous = h.past[h.past.length - 1]!;
		history.value = {
			past: h.past.slice(0, -1),
			present: previous,
			future: [h.present, ...h.future],
		};
	}

	function redo() {
		const h = history.value;
		if (h.future.length === 0) return;
		const next = h.future[0]!;
		history.value = {
			past: [...h.past, h.present],
			present: next,
			future: h.future.slice(1),
		};
	}

	function reset(next?: T) {
		history.value = { past: [], present: next === undefined ? initialValue : next, future: [] };
	}

	function clear() {
		history.value = { past: [], present: history.value.present, future: [] };
	}

	return {
		value: computed(() => history.value.present),
		set,
		undo,
		redo,
		reset,
		clear,
		canUndo: computed(() => history.value.past.length > 0),
		canRedo: computed(() => history.value.future.length > 0),
		pastSize: computed(() => history.value.past.length),
		futureSize: computed(() => history.value.future.length),
	};
}
