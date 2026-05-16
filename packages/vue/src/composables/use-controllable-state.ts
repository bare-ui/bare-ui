import { computed, ref, type MaybeRefOrGetter, type WritableComputedRef, toValue } from 'vue';

export interface UseControllableStateOptions<T> {
	/** Controlled value — when provided, state is owned by the parent */
	value?: MaybeRefOrGetter<T | undefined>;
	/** Initial value when uncontrolled */
	defaultValue?: T;
	/** Called when the value changes (in both controlled and uncontrolled modes) */
	onChange?: (value: T) => void;
}

/**
 * Unified state for components that can be controlled or uncontrolled.
 *
 * - If `value` resolves to a defined value, the composable is controlled — writing only fires `onChange`.
 * - If `value` is undefined, the composable is uncontrolled — writing updates internal state and fires `onChange`.
 *
 * Switching between controlled and uncontrolled across the component's lifetime is unsupported.
 *
 * @example
 * const open = useControllableState({ value: () => props.open, defaultValue: false, onChange: v => emit('update:open', v) })
 * open.value = true
 */
export function useControllableState<T>(
	options: UseControllableStateOptions<T> & { defaultValue: T },
): WritableComputedRef<T>;
export function useControllableState<T>(options: UseControllableStateOptions<T>): WritableComputedRef<T | undefined>;
export function useControllableState<T>(options: UseControllableStateOptions<T>): WritableComputedRef<T | undefined> {
	const { value, defaultValue, onChange } = options;
	const uncontrolled = ref<T | undefined>(defaultValue) as { value: T | undefined };

	return computed<T | undefined>({
		get() {
			const controlled = toValue(value);
			return controlled !== undefined ? controlled : uncontrolled.value;
		},
		set(next) {
			const isControlled = toValue(value) !== undefined;
			if (!isControlled) uncontrolled.value = next;
			if (next !== undefined) onChange?.(next as T);
		},
	});
}
