import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export interface UseStorageOptions<T> {
	/** Custom serializer. Defaults to `JSON.stringify`. */
	serialize?: (value: T) => string;
	/** Custom deserializer. Defaults to `JSON.parse`. */
	deserialize?: (raw: string) => T;
	/** Sync with other tabs via the `storage` event. Defaults to `true` for localStorage, `false` for sessionStorage. */
	syncAcrossTabs?: boolean;
}

export interface UseStorageResult<T> {
	value: Ref<T>;
	/** Replace the stored value (accepts a value or updater function). */
	setValue: (next: T | ((prev: T) => T)) => void;
	/** Remove the key from storage, falling back to the initial value. */
	remove: () => void;
}

function getStorage(kind: 'local' | 'session'): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return kind === 'local' ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}

function createStorageComposable(kind: 'local' | 'session', defaultSync: boolean) {
	return function useStorage<T>(
		key: string,
		initialValue: T,
		options: UseStorageOptions<T> = {},
	): UseStorageResult<T> {
		const { serialize = JSON.stringify, deserialize = JSON.parse, syncAcrossTabs = defaultSync } = options;

		function read(): T {
			const storage = getStorage(kind);
			if (!storage) return initialValue;
			try {
				const raw = storage.getItem(key);
				if (raw === null) return initialValue;
				return deserialize(raw);
			} catch {
				return initialValue;
			}
		}

		const value = ref(read()) as Ref<T>;

		function setValue(next: T | ((prev: T) => T)) {
			const storage = getStorage(kind);
			const resolved =
				typeof next === 'function' ? (next as (prev: T) => T)(value.value) : next;
			value.value = resolved;
			if (!storage) return;
			try {
				const serialized = serialize(resolved);
				storage.setItem(key, serialized);
				// Same-tab notification — the native storage event only fires in other tabs.
				if (typeof window !== 'undefined') {
					window.dispatchEvent(
						new StorageEvent('storage', {
							key,
							newValue: serialized,
							storageArea: storage,
						}),
					);
				}
			} catch {
				// quota exceeded or storage disabled — silently fail
			}
		}

		function remove() {
			const storage = getStorage(kind);
			value.value = initialValue;
			if (!storage) return;
			try {
				storage.removeItem(key);
				if (typeof window !== 'undefined') {
					window.dispatchEvent(
						new StorageEvent('storage', { key, newValue: null, storageArea: storage }),
					);
				}
			} catch {
				// noop
			}
		}

		function onStorage(event: StorageEvent) {
			const storage = getStorage(kind);
			if (!storage || event.storageArea !== storage) return;
			if (event.key !== key && event.key !== null) return;
			value.value = read();
		}

		onMounted(() => {
			value.value = read();
			if (!syncAcrossTabs || kind !== 'local' || typeof window === 'undefined') return;
			window.addEventListener('storage', onStorage);
		});

		onUnmounted(() => {
			if (!syncAcrossTabs || kind !== 'local' || typeof window === 'undefined') return;
			window.removeEventListener('storage', onStorage);
		});

		return { value, setValue, remove };
	};
}

/**
 * Reactive state backed by `window.localStorage`, synced across tabs by default.
 *
 * SSR-safe — uses `initialValue` until mounted on the client.
 *
 * @example
 * const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'light')
 */
export const useLocalStorage = createStorageComposable('local', true);

/**
 * Reactive state backed by `window.sessionStorage` (cleared when the tab closes).
 *
 * Cross-tab sync is not applicable.
 *
 * @example
 * const { value: draft, setValue } = useSessionStorage('draft', '')
 */
export const useSessionStorage = createStorageComposable('session', false);
