import { ref, watch, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

/**
 * Returns the value held by `source` before its most recent change. Returns
 * `undefined` until `source` changes for the first time.
 *
 * Use to detect transitions — comparing the previous and current value lets you
 * react only on edges rather than every render.
 *
 * @example
 * const prev = usePrevious(() => count.value)
 * watch(count, (next) => {
 *   if (prev.value !== undefined && prev.value !== next) onChange(prev.value, next)
 * })
 */
export function usePrevious<T>(source: MaybeRefOrGetter<T>): Ref<T | undefined> {
	const previous = ref<T | undefined>(undefined) as Ref<T | undefined>;

	watch(
		() => toValue(source),
		(_next, prev) => {
			previous.value = prev;
		},
		{ flush: 'sync' },
	);

	return previous;
}
