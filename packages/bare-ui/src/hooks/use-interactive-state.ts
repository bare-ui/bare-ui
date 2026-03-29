import { useState } from 'react';

export interface InteractiveStateOptions {
	disabled?: boolean;
}

export interface InteractiveStateResult {
	/** Spread onto the element to wire up interaction tracking */
	handlers: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onFocus: (e: React.FocusEvent) => void;
		onBlur: () => void;
		onPointerDown: () => void;
		onPointerUp: () => void;
		onKeyDown: (e: React.KeyboardEvent) => void;
		onKeyUp: (e: React.KeyboardEvent) => void;
	};
	/** Spread onto the element to apply state as data attributes */
	dataAttributes: {
		'data-hover'?: '';
		'data-focus-visible'?: '';
		'data-active'?: '';
		'data-disabled'?: '';
	};
	/** Raw booleans for programmatic use */
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
 *
 * Unlike Headless UI's `data-focus` (any focus), bare-ui uses `data-focus-visible`
 * which only applies when focus originates from keyboard navigation — mirroring the
 * CSS `:focus-visible` pseudo-class behaviour detected via `element.matches(':focus-visible')`.
 *
 * @example
 * function MyCard({ disabled }: { disabled?: boolean }) {
 *   const { handlers, dataAttributes } = useInteractiveState({ disabled })
 *   return <div {...handlers} {...dataAttributes} />
 * }
 */
export function useInteractiveState(options: InteractiveStateOptions = {}): InteractiveStateResult {
	const { disabled = false } = options;

	const [isHovered, setIsHovered] = useState(false);
	const [isFocusVisible, setIsFocusVisible] = useState(false);
	const [isActive, setIsActive] = useState(false);

	const handlers: InteractiveStateResult['handlers'] = {
		onMouseEnter: () => {
			if (!disabled) setIsHovered(true);
		},
		onMouseLeave: () => {
			setIsHovered(false);
			setIsActive(false);
		},
		onFocus: (e: React.FocusEvent) => {
			if ((e.currentTarget as Element).matches(':focus-visible')) {
				setIsFocusVisible(true);
			}
		},
		onBlur: () => {
			setIsFocusVisible(false);
			setIsActive(false);
		},
		onPointerDown: () => {
			if (!disabled) setIsActive(true);
		},
		onPointerUp: () => {
			setIsActive(false);
		},
		onKeyDown: (e: React.KeyboardEvent) => {
			if ((e.key === ' ' || e.key === 'Enter') && !disabled) setIsActive(true);
		},
		onKeyUp: (e: React.KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') setIsActive(false);
		},
	};

	const dataAttributes: InteractiveStateResult['dataAttributes'] = {
		'data-hover': isHovered ? '' : undefined,
		'data-focus-visible': isFocusVisible ? '' : undefined,
		'data-active': isActive ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
	};

	return { handlers, dataAttributes, isHovered, isFocusVisible, isActive };
}
