import { renderHook } from '@solidjs/testing-library';
import { createLocalStorage, createSessionStorage } from '@/primitives/create-storage';

describe('createLocalStorage', () => {
	beforeEach(() => localStorage.clear());

	it('returns the initial value when the key is empty', () => {
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 'fallback'));
		const [value] = result;
		expect(value()).toBe('fallback');
		cleanup();
	});

	it('hydrates from existing storage', () => {
		localStorage.setItem('key', JSON.stringify('stored'));
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 'fallback'));
		const [value] = result;
		expect(value()).toBe('stored');
		cleanup();
	});

	it('setValue writes to localStorage and updates the accessor', () => {
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 0));
		const [value, setValue] = result;
		setValue(5);
		expect(value()).toBe(5);
		expect(localStorage.getItem('key')).toBe(JSON.stringify(5));
		cleanup();
	});

	it('setValue accepts an updater function', () => {
		const { result, cleanup } = renderHook(() => createLocalStorage('count', 1));
		const [value, setValue] = result;
		setValue((prev) => prev + 1);
		expect(value()).toBe(2);
		cleanup();
	});

	it('remove() resets to the initial value and clears the key', () => {
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 'init'));
		const [value, setValue, remove] = result;
		setValue('changed');
		remove();
		expect(value()).toBe('init');
		expect(localStorage.getItem('key')).toBeNull();
		cleanup();
	});

	it('falls back to initial value when stored JSON is malformed', () => {
		localStorage.setItem('key', '{not-json');
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 'fallback'));
		const [value] = result;
		expect(value()).toBe('fallback');
		cleanup();
	});

	it('syncs from a foreign storage event', () => {
		const { result, cleanup } = renderHook(() => createLocalStorage('key', 'init'));
		const [value] = result;
		localStorage.setItem('key', JSON.stringify('from-other-tab'));
		window.dispatchEvent(
			new StorageEvent('storage', {
				key: 'key',
				newValue: JSON.stringify('from-other-tab'),
				storageArea: localStorage,
			}),
		);
		expect(value()).toBe('from-other-tab');
		cleanup();
	});
});

describe('createSessionStorage', () => {
	beforeEach(() => sessionStorage.clear());

	it('returns the initial value when the key is empty', () => {
		const { result, cleanup } = renderHook(() => createSessionStorage('s-key', 'fallback'));
		const [value] = result;
		expect(value()).toBe('fallback');
		cleanup();
	});

	it('writes to sessionStorage', () => {
		const { result, cleanup } = renderHook(() => createSessionStorage('s-key', 0));
		const [, setValue] = result;
		setValue(42);
		expect(sessionStorage.getItem('s-key')).toBe(JSON.stringify(42));
		cleanup();
	});
});
