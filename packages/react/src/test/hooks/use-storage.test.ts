import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useSessionStorage } from '@/hooks/use-storage';

describe('useLocalStorage', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	afterEach(() => {
		window.localStorage.clear();
	});

	it('returns initial value when key is empty', () => {
		const { result } = renderHook(() => useLocalStorage('count', 0));
		expect(result.current[0]).toBe(0);
	});

	it('reads existing value from storage on mount', () => {
		window.localStorage.setItem('theme', JSON.stringify('dark'));
		const { result } = renderHook(() => useLocalStorage('theme', 'light'));
		expect(result.current[0]).toBe('dark');
	});

	it('writes value via setValue and persists to localStorage', () => {
		const { result } = renderHook(() => useLocalStorage('count', 0));
		act(() => {
			result.current[1](5);
		});
		expect(result.current[0]).toBe(5);
		expect(window.localStorage.getItem('count')).toBe('5');
	});

	it('supports updater function form of setValue', () => {
		const { result } = renderHook(() => useLocalStorage('count', 1));
		act(() => {
			result.current[1]((prev) => prev + 10);
		});
		expect(result.current[0]).toBe(11);
	});

	it('remove clears the storage entry and resets to initial value', () => {
		const { result } = renderHook(() => useLocalStorage('name', 'init'));
		act(() => {
			result.current[1]('changed');
		});
		expect(result.current[0]).toBe('changed');
		act(() => {
			result.current[2]();
		});
		expect(result.current[0]).toBe('init');
		expect(window.localStorage.getItem('name')).toBeNull();
	});

	it('falls back to initial value when stored value is invalid JSON', () => {
		window.localStorage.setItem('broken', '{not json');
		const { result } = renderHook(() => useLocalStorage('broken', 'fallback'));
		expect(result.current[0]).toBe('fallback');
	});

	it('keeps multiple instances of the same key in sync', () => {
		const { result: a } = renderHook(() => useLocalStorage('shared', 0));
		const { result: b } = renderHook(() => useLocalStorage('shared', 0));
		act(() => {
			a.current[1](42);
		});
		expect(a.current[0]).toBe(42);
		expect(b.current[0]).toBe(42);
	});

	it('supports custom serialize/deserialize options', () => {
		const { result } = renderHook(() =>
			useLocalStorage<number>('hex', 255, {
				serialize: (n) => n.toString(16),
				deserialize: (raw) => parseInt(raw, 16),
			}),
		);
		act(() => {
			result.current[1](16);
		});
		expect(window.localStorage.getItem('hex')).toBe('10');
		expect(result.current[0]).toBe(16);
	});
});

describe('useSessionStorage', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
	});

	afterEach(() => {
		window.sessionStorage.clear();
	});

	it('returns initial value when key is empty', () => {
		const { result } = renderHook(() => useSessionStorage('draft', ''));
		expect(result.current[0]).toBe('');
	});

	it('persists value to sessionStorage', () => {
		const { result, rerender } = renderHook(() => useSessionStorage('draft', ''));
		act(() => {
			result.current[1]('hello');
		});
		// sessionStorage hook does not subscribe (no cross-tab sync), so the
		// snapshot is only re-read on the next render.
		rerender();
		expect(window.sessionStorage.getItem('draft')).toBe('"hello"');
		expect(window.localStorage.getItem('draft')).toBeNull();
		expect(result.current[0]).toBe('hello');
	});

	it('remove clears the sessionStorage entry', () => {
		const { result, rerender } = renderHook(() => useSessionStorage('draft', ''));
		act(() => {
			result.current[1]('hello');
		});
		act(() => {
			result.current[2]();
		});
		rerender();
		expect(window.sessionStorage.getItem('draft')).toBeNull();
		expect(result.current[0]).toBe('');
	});
});
