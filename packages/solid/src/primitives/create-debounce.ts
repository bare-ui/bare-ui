import { createSignal, createEffect, onCleanup, type Accessor } from 'solid-js';

/**
 * Returns a reactive value debounced — only updates after `delay` ms have passed without a change.
 *
 * Pass the input as an accessor so Solid can track changes reactively.
 *
 * @example
 * const debouncedQuery = createDebounce(() => query(), 250)
 * createEffect(() => { search(debouncedQuery()) })
 */
export function createDebounce<T>(value: Accessor<T>, delay: number): Accessor<T> {
	const [debounced, setDebounced] = createSignal<T>(value() as T);

	createEffect(() => {
		const v = value();
		const id = setTimeout(() => setDebounced(() => v), delay);
		onCleanup(() => clearTimeout(id));
	});

	return debounced;
}

/**
 * Returns a stable, debounced callback that fires `delay` ms after the most recent invocation.
 * Always calls the latest `callback` reference, so closure-captured values stay fresh.
 *
 * @example
 * const debouncedSave = createDebouncedCallback((value: string) => save(value), 500)
 */
export function createDebouncedCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	let timerRef: ReturnType<typeof setTimeout> | null = null;

	onCleanup(() => {
		if (timerRef) clearTimeout(timerRef);
	});

	return (...args: Args) => {
		if (timerRef) clearTimeout(timerRef);
		timerRef = setTimeout(() => callback(...args), delay);
	};
}
