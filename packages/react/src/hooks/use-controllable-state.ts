import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

export interface UseControllableStateOptions<T> {
	/** Controlled value — when provided, state is owned by the parent */
	value?: T;
	/** Initial value when uncontrolled */
	defaultValue?: T;
	/** Called when the value changes (in both controlled and uncontrolled modes) */
	onChange?: (value: T) => void;
}

/**
 * Unified state for components that can be controlled or uncontrolled.
 *
 * - If `value` is provided, the hook is controlled — `setValue` only fires `onChange`.
 * - If `value` is undefined, the hook is uncontrolled — `setValue` updates internal state and fires `onChange`.
 *
 * Switching between controlled and uncontrolled across renders is unsupported (React warns about this).
 *
 * @example
 * const [open, setOpen] = useControllableState({ value: props.open, defaultValue: false, onChange: props.onOpenChange })
 */
export function useControllableState<T>(
	options: UseControllableStateOptions<T> & { defaultValue: T },
): [T, Dispatch<SetStateAction<T>>];
export function useControllableState<T>(
	options: UseControllableStateOptions<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useControllableState<T>(
	options: UseControllableStateOptions<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
	const { value, defaultValue, onChange } = options;
	const [uncontrolled, setUncontrolled] = useState<T | undefined>(defaultValue);
	const isControlled = value !== undefined;
	const current = isControlled ? value : uncontrolled;

	const setValue = useCallback<Dispatch<SetStateAction<T | undefined>>>(
		(next) => {
			const resolved = typeof next === 'function' ? (next as (prev: T | undefined) => T | undefined)(current) : next;
			if (!isControlled) setUncontrolled(resolved);
			if (resolved !== undefined) onChange?.(resolved as T);
		},
		[current, isControlled, onChange],
	);

	return [current, setValue];
}
