import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '@/hooks/use-undo-redo';

describe('useUndoRedo', () => {
	it('starts with the initial value and empty history', () => {
		const { result } = renderHook(() => useUndoRedo('a'));
		expect(result.current.value).toBe('a');
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(false);
		expect(result.current.pastSize).toBe(0);
		expect(result.current.futureSize).toBe(0);
	});

	it('set pushes the previous value onto the past stack', () => {
		const { result } = renderHook(() => useUndoRedo(0));
		act(() => result.current.set(1));
		expect(result.current.value).toBe(1);
		expect(result.current.pastSize).toBe(1);
		expect(result.current.canUndo).toBe(true);
		expect(result.current.canRedo).toBe(false);
	});

	it('supports functional updaters in set', () => {
		const { result } = renderHook(() => useUndoRedo(1));
		act(() => result.current.set((prev) => prev + 9));
		expect(result.current.value).toBe(10);
	});

	it('ignores set when the resolved value is identical', () => {
		const { result } = renderHook(() => useUndoRedo(5));
		act(() => result.current.set(5));
		expect(result.current.pastSize).toBe(0);
		expect(result.current.value).toBe(5);
	});

	it('undo steps back and enables redo', () => {
		const { result } = renderHook(() => useUndoRedo('a'));
		act(() => result.current.set('b'));
		act(() => result.current.undo());
		expect(result.current.value).toBe('a');
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(true);
		expect(result.current.futureSize).toBe(1);
	});

	it('redo reapplies an undone value', () => {
		const { result } = renderHook(() => useUndoRedo('a'));
		act(() => result.current.set('b'));
		act(() => result.current.undo());
		act(() => result.current.redo());
		expect(result.current.value).toBe('b');
		expect(result.current.canRedo).toBe(false);
	});

	it('set clears the future stack', () => {
		const { result } = renderHook(() => useUndoRedo(0));
		act(() => result.current.set(1));
		act(() => result.current.set(2));
		act(() => result.current.undo());
		expect(result.current.futureSize).toBe(1);
		act(() => result.current.set(99));
		expect(result.current.futureSize).toBe(0);
		expect(result.current.canRedo).toBe(false);
	});

	it('undo and redo are no-ops when stacks are empty', () => {
		const { result } = renderHook(() => useUndoRedo('x'));
		act(() => result.current.undo());
		act(() => result.current.redo());
		expect(result.current.value).toBe('x');
		expect(result.current.pastSize).toBe(0);
		expect(result.current.futureSize).toBe(0);
	});

	it('respects the limit option', () => {
		const { result } = renderHook(() => useUndoRedo(0, { limit: 2 }));
		act(() => result.current.set(1));
		act(() => result.current.set(2));
		act(() => result.current.set(3));
		// past should only retain the most recent 2 entries (1, 2)
		expect(result.current.pastSize).toBe(2);
		act(() => result.current.undo());
		expect(result.current.value).toBe(2);
		act(() => result.current.undo());
		expect(result.current.value).toBe(1);
		expect(result.current.canUndo).toBe(false);
	});

	it('reset clears both stacks and restores the value', () => {
		const { result } = renderHook(() => useUndoRedo('a'));
		act(() => result.current.set('b'));
		act(() => result.current.set('c'));
		act(() => result.current.reset());
		expect(result.current.value).toBe('a');
		expect(result.current.pastSize).toBe(0);
		expect(result.current.futureSize).toBe(0);
	});

	it('reset(next) sets a new value with empty stacks', () => {
		const { result } = renderHook(() => useUndoRedo('a'));
		act(() => result.current.set('b'));
		act(() => result.current.reset('z'));
		expect(result.current.value).toBe('z');
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(false);
	});

	it('clear empties history but keeps current value', () => {
		const { result } = renderHook(() => useUndoRedo(0));
		act(() => result.current.set(1));
		act(() => result.current.set(2));
		act(() => result.current.clear());
		expect(result.current.value).toBe(2);
		expect(result.current.pastSize).toBe(0);
		expect(result.current.futureSize).toBe(0);
	});
});
