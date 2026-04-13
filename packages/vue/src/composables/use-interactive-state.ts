import { ref, computed, type MaybeRefOrGetter, toValue } from 'vue';

export interface InteractiveStateOptions {
	disabled?: MaybeRefOrGetter<boolean>;
}

export interface InteractiveStateResult {
	handlers: {
		onMouseenter: () => void;
		onMouseleave: () => void;
		onFocus: (e: FocusEvent) => void;
		onBlur: () => void;
		onPointerdown: () => void;
		onPointerup: () => void;
		onKeydown: (e: KeyboardEvent) => void;
		onKeyup: (e: KeyboardEvent) => void;
	};
	dataAttributes: Record<string, string | undefined>;
	isHovered: boolean;
	isFocusVisible: boolean;
	isActive: boolean;
}

/**
 * Tracks interactive state (hover, focus-visible, active/pressed) for any element.
 *
 * Returns event handlers to wire onto the element and matching data attributes
 * to apply to the DOM — so consumers can style states with CSS selectors like
 * `[data-hover]`, `[data-focus-visible]`, `[data-active]`, `[data-disabled]`.
 */
export function useInteractiveState(options: InteractiveStateOptions = {}) {
	const isHovered = ref(false);
	const isFocusVisible = ref(false);
	const isActive = ref(false);

	const handlers = {
		onMouseenter: () => {
			if (!toValue(options.disabled)) isHovered.value = true;
		},
		onMouseleave: () => {
			isHovered.value = false;
			isActive.value = false;
		},
		onFocus: (e: FocusEvent) => {
			if ((e.currentTarget as Element)?.matches(':focus-visible')) {
				isFocusVisible.value = true;
			}
		},
		onBlur: () => {
			isFocusVisible.value = false;
			isActive.value = false;
		},
		onPointerdown: () => {
			if (!toValue(options.disabled)) isActive.value = true;
		},
		onPointerup: () => {
			isActive.value = false;
		},
		onKeydown: (e: KeyboardEvent) => {
			if ((e.key === ' ' || e.key === 'Enter') && !toValue(options.disabled)) isActive.value = true;
		},
		onKeyup: (e: KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') isActive.value = false;
		},
	};

	const dataAttributes = computed(() => ({
		'data-hover': isHovered.value ? '' : undefined,
		'data-focus-visible': isFocusVisible.value ? '' : undefined,
		'data-active': isActive.value ? '' : undefined,
		'data-disabled': toValue(options.disabled) ? '' : undefined,
	}));

	return {
		handlers,
		dataAttributes,
		isHovered,
		isFocusVisible,
		isActive,
	};
}
