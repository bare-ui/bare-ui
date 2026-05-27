import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import { useLocalStorage, useSessionStorage, type UseStorageResult } from '@/composables/use-storage';

function mountLocal<T>(key: string, initial: T): UseStorageResult<T> {
	let captured!: UseStorageResult<T>;
	const Harness = defineComponent({
		setup() {
			captured = useLocalStorage(key, initial);
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

function mountSession<T>(key: string, initial: T): UseStorageResult<T> {
	let captured!: UseStorageResult<T>;
	const Harness = defineComponent({
		setup() {
			captured = useSessionStorage(key, initial);
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useLocalStorage', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('returns the initial value when the key is empty', () => {
		const { value } = mountLocal('key', 'fallback');
		expect(value.value).toBe('fallback');
	});

	it('hydrates from existing storage', () => {
		localStorage.setItem('key', JSON.stringify('stored'));
		const { value } = mountLocal('key', 'fallback');
		expect(value.value).toBe('stored');
	});

	it('setValue writes to localStorage and updates the ref', () => {
		const { value, setValue } = mountLocal('key', 0);
		setValue(5);
		expect(value.value).toBe(5);
		expect(localStorage.getItem('key')).toBe(JSON.stringify(5));
	});

	it('setValue accepts an updater function', () => {
		const { value, setValue } = mountLocal('count', 1);
		setValue((prev) => prev + 1);
		expect(value.value).toBe(2);
	});

	it('remove() resets to the initial value and clears the key', () => {
		const { value, setValue, remove } = mountLocal('key', 'init');
		setValue('changed');
		remove();
		expect(value.value).toBe('init');
		expect(localStorage.getItem('key')).toBeNull();
	});

	it('falls back to initial value when stored JSON is malformed', () => {
		localStorage.setItem('key', '{not-json');
		const { value } = mountLocal('key', 'fallback');
		expect(value.value).toBe('fallback');
	});

	it('syncs from a foreign storage event', async () => {
		const { value } = mountLocal('key', 'init');
		localStorage.setItem('key', JSON.stringify('from-other-tab'));
		window.dispatchEvent(
			new StorageEvent('storage', {
				key: 'key',
				newValue: JSON.stringify('from-other-tab'),
				storageArea: localStorage,
			}),
		);
		await nextTick();
		expect(value.value).toBe('from-other-tab');
	});
});

describe('useSessionStorage', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it('returns the initial value when the key is empty', () => {
		const { value } = mountSession('s-key', 'fallback');
		expect(value.value).toBe('fallback');
	});

	it('writes to sessionStorage', () => {
		const { setValue } = mountSession('s-key', 0);
		setValue(42);
		expect(sessionStorage.getItem('s-key')).toBe(JSON.stringify(42));
	});
});
