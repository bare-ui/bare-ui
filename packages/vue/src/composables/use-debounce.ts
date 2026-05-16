import { ref, watch, onUnmounted, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

/**
 * Returns `source` debounced — only updates after `delay` ms have passed without a change.
 *
 * Use for derived state that drives expensive work (network requests, filters).
 *
 * @example
 * const debouncedQuery = useDebounce(() => query.value, 250)
 * watch(debouncedQuery, value => search(value))
 */
export function useDebounce<T>(source: MaybeRefOrGetter<T>, delay: number): Ref<T> {
	const debounced = ref(toValue(source)) as Ref<T>;
	let timer: ReturnType<typeof setTimeout> | null = null;

	watch(
		() => toValue(source),
		(value) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				debounced.value = value;
			}, delay);
		},
	);

	onUnmounted(() => {
		if (timer) clearTimeout(timer);
	});

	return debounced;
}

/**
 * Returns a stable, debounced version of `callback` that fires `delay` ms after the
 * most recent invocation.
 *
 * @example
 * const debouncedSave = useDebouncedCallback((value: string) => save(value), 500)
 */
export function useDebouncedCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	let timer: ReturnType<typeof setTimeout> | null = null;

	onUnmounted(() => {
		if (timer) clearTimeout(timer);
	});

	return (...args: Args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => callback(...args), delay);
	};
}
