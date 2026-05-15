import { createSignal } from 'solid-js';

export interface CreateControllableStateOptions<T> {
	/** Controlled value — when provided, state is owned by the parent */
	value?: T;
	/** Initial value when uncontrolled */
	defaultValue?: T;
	/** Called when the value changes (in both controlled and uncontrolled modes) */
	onChange?: (value: T) => void;
}

type ControllableSetter<T> = (next: T | undefined | ((prev: T | undefined) => T | undefined)) => void;

/**
 * Unified state for components that can be controlled or uncontrolled.
 *
 * - If `value` is provided on `options`, the state is controlled — the setter only fires `onChange`.
 * - If `value` is undefined, the state is uncontrolled — the setter updates internal state and fires `onChange`.
 *
 * Pass `options` as a plain object or with getters to make `value` reactive:
 * `{ get value() { return props.value; }, onChange: props.onValueChange }`
 *
 * @example
 * const [open, setOpen] = createControllableState({ get value() { return props.open }, defaultValue: false, onChange: props.onOpenChange })
 */
export function createControllableState<T>(
	options: CreateControllableStateOptions<T> & { defaultValue: T },
): [() => T, ControllableSetter<T>];
export function createControllableState<T>(
	options: CreateControllableStateOptions<T>,
): [() => T | undefined, ControllableSetter<T | undefined>];
export function createControllableState<T>(
	options: CreateControllableStateOptions<T>,
): [() => T | undefined, ControllableSetter<T | undefined>] {
	const [uncontrolled, setUncontrolled] = createSignal<T | undefined>(options.defaultValue);

	const current = () => (options.value !== undefined ? options.value : uncontrolled());

	const setValue: ControllableSetter<T | undefined> = (next) => {
		const resolved = typeof next === 'function' ? (next as (prev: T | undefined) => T | undefined)(current()) : next;
		if (options.value === undefined) setUncontrolled(resolved as any);
		if (resolved !== undefined) options.onChange?.(resolved as T);
	};

	return [current, setValue];
}
