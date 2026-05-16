import { ref, type Ref } from 'vue';

export interface UseFocusVisibleResult {
	isFocusVisible: Ref<boolean>;
	focusHandlers: {
		onFocus: (event: FocusEvent) => void;
		onBlur: () => void;
	};
}

/**
 * Tracks whether the focused element should show a "focus visible" indicator —
 * i.e. focus arrived from keyboard navigation, not a pointer.
 *
 * Mirrors the CSS `:focus-visible` pseudo-class by querying `element.matches(':focus-visible')`
 * on focus. Spread `focusHandlers` onto the target element.
 *
 * @example
 * const { isFocusVisible, focusHandlers } = useFocusVisible()
 * <button v-bind="focusHandlers" :data-focus-visible="isFocusVisible ? '' : undefined" />
 */
export function useFocusVisible(): UseFocusVisibleResult {
	const isFocusVisible = ref(false);

	function onFocus(event: FocusEvent) {
		const target = event.currentTarget as Element | null;
		try {
			isFocusVisible.value = target?.matches(':focus-visible') ?? false;
		} catch {
			isFocusVisible.value = false;
		}
	}

	function onBlur() {
		isFocusVisible.value = false;
	}

	return { isFocusVisible, focusHandlers: { onFocus, onBlur } };
}
