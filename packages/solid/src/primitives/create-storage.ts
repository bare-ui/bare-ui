import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

export interface CreateStorageOptions<T> {
	/** Custom serializer. Defaults to `JSON.stringify`. */
	serialize?: (value: T) => string;
	/** Custom deserializer. Defaults to `JSON.parse`. */
	deserialize?: (raw: string) => T;
	/** Sync with other tabs via the `storage` event. Defaults to `true` for localStorage, `false` for sessionStorage. */
	syncAcrossTabs?: boolean;
}

export type CreateStorageResult<T> = [Accessor<T>, (value: T | ((prev: T) => T)) => void, () => void];

function getStorage(kind: 'local' | 'session'): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return kind === 'local' ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}

function makeStoragePrimitive(kind: 'local' | 'session', defaultSync: boolean) {
	return function createStorage<T>(
		key: string,
		initialValue: T,
		options: CreateStorageOptions<T> = {},
	): CreateStorageResult<T> {
		const { serialize = JSON.stringify, deserialize = JSON.parse, syncAcrossTabs = defaultSync } = options;

		const read = (): T => {
			const storage = getStorage(kind);
			if (!storage) return initialValue;
			try {
				const raw = storage.getItem(key);
				if (raw === null) return initialValue;
				return deserialize(raw);
			} catch {
				return initialValue;
			}
		};

		const [value, setValue] = createSignal<T>(read());

		onMount(() => {
			// Re-read on mount in case storage changed between SSR and hydration.
			setValue(() => read());

			if (typeof window === 'undefined') return;
			if (!syncAcrossTabs || kind !== 'local') return;

			const onStorage = (event: StorageEvent) => {
				if (event.storageArea !== window.localStorage) return;
				if (event.key !== key) return;
				setValue(() => read());
			};
			window.addEventListener('storage', onStorage);
			onCleanup(() => window.removeEventListener('storage', onStorage));
		});

		const set = (next: T | ((prev: T) => T)) => {
			const storage = getStorage(kind);
			const resolved = typeof next === 'function' ? (next as (prev: T) => T)(value()) : next;
			setValue(() => resolved);
			if (!storage) return;
			try {
				const serialized = serialize(resolved);
				storage.setItem(key, serialized);
				if (typeof window !== 'undefined' && syncAcrossTabs && kind === 'local') {
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
		};

		const remove = () => {
			const storage = getStorage(kind);
			setValue(() => initialValue);
			if (!storage) return;
			try {
				storage.removeItem(key);
				if (typeof window !== 'undefined' && syncAcrossTabs && kind === 'local') {
					window.dispatchEvent(
						new StorageEvent('storage', { key, newValue: null, storageArea: storage }),
					);
				}
			} catch {
				// noop
			}
		};

		return [value, set, remove];
	};
}

/**
 * Stores state in `window.localStorage`, syncing across tabs by default.
 *
 * Returns `[value, setValue, remove]` where `value` is a reactive accessor.
 * SSR-safe — falls back to `initialValue` on the server.
 *
 * @example
 * const [theme, setTheme] = createLocalStorage('theme', 'light')
 * <p>Current theme: {theme()}</p>
 */
export const createLocalStorage = makeStoragePrimitive('local', true);

/**
 * Stores state in `window.sessionStorage` (cleared when the tab closes).
 *
 * Returns `[value, setValue, remove]` where `value` is a reactive accessor.
 * Cross-tab sync is not applicable.
 *
 * @example
 * const [draft, setDraft] = createSessionStorage('draft', '')
 */
export const createSessionStorage = makeStoragePrimitive('session', false);
