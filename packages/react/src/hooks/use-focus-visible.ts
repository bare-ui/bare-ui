import { useCallback, useState, type FocusEvent } from 'react';

export interface UseFocusVisibleResult {
	isFocusVisible: boolean;
	focusProps: {
		onFocus: (event: FocusEvent<Element>) => void;
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
 * const { isFocusVisible, focusProps } = useFocusVisible()
 * <button {...focusProps} data-focus-visible={isFocusVisible ? '' : undefined} />
 */
export function useFocusVisible(): UseFocusVisibleResult {
	const [isFocusVisible, setIsFocusVisible] = useState(false);

	const onFocus = useCallback((event: FocusEvent<Element>) => {
		const target = event.currentTarget;
		try {
			setIsFocusVisible(target.matches(':focus-visible'));
		} catch {
			setIsFocusVisible(false);
		}
	}, []);

	const onBlur = useCallback(() => setIsFocusVisible(false), []);

	return { isFocusVisible, focusProps: { onFocus, onBlur } };
}
