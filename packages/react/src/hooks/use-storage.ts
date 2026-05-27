import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

export interface UseStorageOptions<T> {
	/** Custom serializer. Defaults to `JSON.stringify`. */
	serialize?: (value: T) => string;
	/** Custom deserializer. Defaults to `JSON.parse`. */
	deserialize?: (raw: string) => T;
	/** Sync with other tabs via the `storage` event. Defaults to `true` for localStorage, `false` for sessionStorage. */
	syncAcrossTabs?: boolean;
}

export type UseStorageResult<T> = [T, (value: T | ((prev: T) => T)) => void, () => void];

function getStorage(kind: 'local' | 'session'): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return kind === 'local' ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}

function createStorageHook(kind: 'local' | 'session', defaultSync: boolean) {
	return function useStorage<T>(
		key: string,
		initialValue: T,
		options: UseStorageOptions<T> = {},
	): UseStorageResult<T> {
		const { serialize = JSON.stringify, deserialize = JSON.parse, syncAcrossTabs = defaultSync } = options;
		const initialRef = useRef(initialValue);
		const serializeRef = useRef(serialize);
		const deserializeRef = useRef(deserialize);
		useEffect(() => {
			serializeRef.current = serialize;
			deserializeRef.current = deserialize;
		}, [serialize, deserialize]);

		const subscribe = useCallback(
			(notify: () => void) => {
				if (!syncAcrossTabs || kind !== 'local' || typeof window === 'undefined') return () => {};
				function onStorage(event: StorageEvent) {
					if (event.storageArea === window.localStorage && event.key === key) notify();
				}
				window.addEventListener('storage', onStorage);
				return () => window.removeEventListener('storage', onStorage);
			},
			[key, syncAcrossTabs],
		);

		const getSnapshot = useCallback((): string | null => {
			const storage = getStorage(kind);
			if (!storage) return null;
			try {
				return storage.getItem(key);
			} catch {
				return null;
			}
		}, [key]);

		const getServerSnapshot = useCallback((): string | null => null, []);

		const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

		let value: T;
		if (raw === null || raw === undefined) {
			value = initialRef.current;
		} else {
			try {
				value = deserializeRef.current(raw);
			} catch {
				value = initialRef.current;
			}
		}

		const setValue = useCallback(
			(next: T | ((prev: T) => T)) => {
				const storage = getStorage(kind);
				if (!storage) return;
				const current = (() => {
					const r = storage.getItem(key);
					if (r === null) return initialRef.current;
					try {
						return deserializeRef.current(r);
					} catch {
						return initialRef.current;
					}
				})();
				const resolved =
					typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
				try {
					storage.setItem(key, serializeRef.current(resolved));
					// Same-tab notification — storage event only fires in other tabs.
					if (typeof window !== 'undefined') {
						window.dispatchEvent(
							new StorageEvent('storage', {
								key,
								newValue: serializeRef.current(resolved),
								storageArea: storage,
							}),
						);
					}
				} catch {
					// quota exceeded or storage disabled — silently fail
				}
			},
			[key],
		);

		const remove = useCallback(() => {
			const storage = getStorage(kind);
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
		}, [key]);

		return [value, setValue, remove];
	};
}

/**
 * Stores state in `window.localStorage`, syncing across tabs by default.
 *
 * Returns `[value, setValue, remove]`. `setValue` accepts a value or updater function.
 * SSR-safe — uses `initialValue` until hydration.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light')
 */
export const useLocalStorage = createStorageHook('local', true);

/**
 * Stores state in `window.sessionStorage` (cleared when the tab closes).
 *
 * Returns `[value, setValue, remove]`. Cross-tab sync is not applicable.
 *
 * @example
 * const [draft, setDraft] = useSessionStorage('draft', '')
 */
export const useSessionStorage = createStorageHook('session', false);
