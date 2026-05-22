import { createRoot } from 'solid-js';
import { createUndoRedo } from '@/primitives/create-undo-redo';

describe('createUndoRedo', () => {
	it('starts at the initial value with no history', () => {
		createRoot((dispose) => {
			const { value, canUndo, canRedo, pastSize, futureSize } = createUndoRedo('a');
			expect(value()).toBe('a');
			expect(canUndo()).toBe(false);
			expect(canRedo()).toBe(false);
			expect(pastSize()).toBe(0);
			expect(futureSize()).toBe(0);
			dispose();
		});
	});

	it('set() pushes the current value onto the past stack', () => {
		createRoot((dispose) => {
			const { value, set, canUndo, pastSize } = createUndoRedo('a');
			set('b');
			expect(value()).toBe('b');
			expect(canUndo()).toBe(true);
			expect(pastSize()).toBe(1);
			dispose();
		});
	});

	it('set() with an updater uses the current value', () => {
		createRoot((dispose) => {
			const { value, set } = createUndoRedo(1);
			set((n) => n + 1);
			expect(value()).toBe(2);
			dispose();
		});
	});

	it('set() ignores no-op writes', () => {
		createRoot((dispose) => {
			const { set, pastSize } = createUndoRedo('a');
			set('a');
			expect(pastSize()).toBe(0);
			dispose();
		});
	});

	it('undo() steps back and enables redo', () => {
		createRoot((dispose) => {
			const { value, set, undo, canUndo, canRedo } = createUndoRedo('a');
			set('b');
			set('c');
			undo();
			expect(value()).toBe('b');
			expect(canRedo()).toBe(true);
			undo();
			expect(value()).toBe('a');
			expect(canUndo()).toBe(false);
			dispose();
		});
	});

	it('redo() re-applies an undone value', () => {
		createRoot((dispose) => {
			const { value, set, undo, redo } = createUndoRedo('a');
			set('b');
			undo();
			redo();
			expect(value()).toBe('b');
			dispose();
		});
	});

	it('set() after undo clears the redo stack', () => {
		createRoot((dispose) => {
			const { set, undo, redo, value, canRedo } = createUndoRedo('a');
			set('b');
			undo();
			set('c');
			expect(canRedo()).toBe(false);
			redo();
			expect(value()).toBe('c');
			dispose();
		});
	});

	it('undo() is a no-op when there is no past', () => {
		createRoot((dispose) => {
			const { undo, value } = createUndoRedo('a');
			undo();
			expect(value()).toBe('a');
			dispose();
		});
	});

	it('redo() is a no-op when there is no future', () => {
		createRoot((dispose) => {
			const { redo, set, value } = createUndoRedo('a');
			set('b');
			redo();
			expect(value()).toBe('b');
			dispose();
		});
	});

	it('respects the limit option', () => {
		createRoot((dispose) => {
			const { set, pastSize } = createUndoRedo('a', { limit: 2 });
			set('b');
			set('c');
			set('d');
			expect(pastSize()).toBe(2);
			dispose();
		});
	});

	it('reset() clears history and returns to the initial value', () => {
		createRoot((dispose) => {
			const { set, reset, value, canUndo, canRedo } = createUndoRedo('a');
			set('b');
			set('c');
			reset();
			expect(value()).toBe('a');
			expect(canUndo()).toBe(false);
			expect(canRedo()).toBe(false);
			dispose();
		});
	});

	it('reset(next) replaces the current value', () => {
		createRoot((dispose) => {
			const { reset, value } = createUndoRedo('a');
			reset('z');
			expect(value()).toBe('z');
			dispose();
		});
	});

	it('clear() removes history without changing the value', () => {
		createRoot((dispose) => {
			const { set, clear, value, canUndo, canRedo } = createUndoRedo('a');
			set('b');
			clear();
			expect(value()).toBe('b');
			expect(canUndo()).toBe(false);
			expect(canRedo()).toBe(false);
			dispose();
		});
	});
});
