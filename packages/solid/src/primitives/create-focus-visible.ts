import { createSignal, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';

export interface CreateFocusVisibleResult {
	/** Reactive accessor — true when focus arrived from keyboard navigation */
	isFocusVisible: Accessor<boolean>;
	focusProps: {
		onFocus: JSX.FocusEventHandler<Element, FocusEvent>;
		onBlur: () => void;
	};
}

/**
 * Tracks whether the focused element should show a "focus visible" indicator —
 * i.e. focus arrived from keyboard navigation, not a pointer.
 *
 * Mirrors the CSS `:focus-visible` pseudo-class by querying `element.matches(':focus-visible')`
 * on focus. Spread `focusProps` onto the target element.
 *
 * @example
 * const { isFocusVisible, focusProps } = createFocusVisible()
 * <button {...focusProps} data-focus-visible={isFocusVisible() ? '' : undefined} />
 */
export function createFocusVisible(): CreateFocusVisibleResult {
	const [isFocusVisible, setIsFocusVisible] = createSignal(false);

	const onFocus: JSX.FocusEventHandler<Element, FocusEvent> = (e) => {
		try {
			setIsFocusVisible((e.currentTarget as Element).matches(':focus-visible'));
		} catch {
			setIsFocusVisible(false);
		}
	};

	return {
		isFocusVisible,
		focusProps: {
			onFocus,
			onBlur: () => setIsFocusVisible(false),
		},
	};
}
