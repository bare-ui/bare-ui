import { useUndoRedo } from '@/composables/use-undo-redo';

describe('useUndoRedo', () => {
	it('starts at the initial value with no history', () => {
		const { value, canUndo, canRedo, pastSize, futureSize } = useUndoRedo('a');
		expect(value.value).toBe('a');
		expect(canUndo.value).toBe(false);
		expect(canRedo.value).toBe(false);
		expect(pastSize.value).toBe(0);
		expect(futureSize.value).toBe(0);
	});

	it('set() pushes the current value onto the past stack', () => {
		const { value, set, canUndo, pastSize } = useUndoRedo('a');
		set('b');
		expect(value.value).toBe('b');
		expect(canUndo.value).toBe(true);
		expect(pastSize.value).toBe(1);
	});

	it('set() with an updater function uses the current value', () => {
		const { value, set } = useUndoRedo(1);
		set((n) => n + 1);
		expect(value.value).toBe(2);
	});

	it('set() ignores no-op writes', () => {
		const { set, pastSize } = useUndoRedo('a');
		set('a');
		expect(pastSize.value).toBe(0);
	});

	it('undo() steps back and enables redo', () => {
		const { value, set, undo, canUndo, canRedo } = useUndoRedo('a');
		set('b');
		set('c');
		undo();
		expect(value.value).toBe('b');
		expect(canRedo.value).toBe(true);
		undo();
		expect(value.value).toBe('a');
		expect(canUndo.value).toBe(false);
	});

	it('redo() re-applies an undone value', () => {
		const { value, set, undo, redo } = useUndoRedo('a');
		set('b');
		undo();
		redo();
		expect(value.value).toBe('b');
	});

	it('set() after undo clears the redo stack', () => {
		const { set, undo, redo, value, canRedo } = useUndoRedo('a');
		set('b');
		undo();
		set('c');
		expect(canRedo.value).toBe(false);
		redo();
		expect(value.value).toBe('c');
	});

	it('undo() is a no-op when there is no past', () => {
		const { undo, value } = useUndoRedo('a');
		undo();
		expect(value.value).toBe('a');
	});

	it('redo() is a no-op when there is no future', () => {
		const { redo, set, value } = useUndoRedo('a');
		set('b');
		redo();
		expect(value.value).toBe('b');
	});

	it('respects the limit option', () => {
		const { set, pastSize } = useUndoRedo('a', { limit: 2 });
		set('b');
		set('c');
		set('d');
		expect(pastSize.value).toBe(2);
	});

	it('reset() clears history and returns to the initial value', () => {
		const { set, reset, value, canUndo, canRedo } = useUndoRedo('a');
		set('b');
		set('c');
		reset();
		expect(value.value).toBe('a');
		expect(canUndo.value).toBe(false);
		expect(canRedo.value).toBe(false);
	});

	it('reset(next) replaces the current value', () => {
		const { reset, value } = useUndoRedo('a');
		reset('z');
		expect(value.value).toBe('z');
	});

	it('clear() removes history without changing the value', () => {
		const { set, clear, value, canUndo, canRedo } = useUndoRedo('a');
		set('b');
		clear();
		expect(value.value).toBe('b');
		expect(canUndo.value).toBe(false);
		expect(canRedo.value).toBe(false);
	});
});
