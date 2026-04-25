import { createSignal, mergeProps, type Accessor, type JSX } from 'solid-js';

export interface InteractiveStateOptions {
	disabled?: boolean;
}

export interface InteractiveStateResult {
	/** Spread onto the element to wire up interaction tracking */
	handlers: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onFocus: JSX.FocusEventHandler<Element, FocusEvent>;
		onBlur: () => void;
		onPointerDown: () => void;
		onPointerUp: () => void;
		onKeyDown: JSX.EventHandler<Element, KeyboardEvent>;
		onKeyUp: JSX.EventHandler<Element, KeyboardEvent>;
	};
	/** Spread onto the element to apply state as data attributes (reactive). */
	dataAttributes: {
		readonly 'data-hover'?: '';
		readonly 'data-focus-visible'?: '';
		readonly 'data-active'?: '';
		readonly 'data-disabled'?: '';
	};
	/** Reactive accessors for programmatic use */
	isHovered: Accessor<boolean>;
	isFocusVisible: Accessor<boolean>;
	isActive: Accessor<boolean>;
}

/**
 * Tracks interactive state (hover, focus-visible, active/pressed) for any element.
 *
 * Returns event handlers to wire onto the element and matching data attributes
 * to apply to the DOM — so consumers can style states with CSS selectors like
 * `[data-hover]`, `[data-focus-visible]`, `[data-active]`, `[data-disabled]`.
 *
 * Unlike libraries that expose `data-focus` (any focus), wire-ui uses
 * `data-focus-visible` which only applies when focus originates from keyboard
 * navigation — mirroring the CSS `:focus-visible` pseudo-class behaviour
 * detected via `element.matches(':focus-visible')`.
 *
 * Pass `options` as a plain object or — to make `disabled` reactive — pass an
 * object with a getter (e.g. `{ get disabled() { return props.disabled; } }`).
 *
 * @example
 * function MyCard(props: { disabled?: boolean }) {
 *   const state = createInteractiveState({ get disabled() { return props.disabled; } });
 *   return <div {...state.handlers} {...state.dataAttributes} />;
 * }
 */
export function createInteractiveState(options: InteractiveStateOptions = {}): InteractiveStateResult {
	const merged = mergeProps({ disabled: false }, options);

	const [isHovered, setIsHovered] = createSignal(false);
	const [isFocusVisible, setIsFocusVisible] = createSignal(false);
	const [isActive, setIsActive] = createSignal(false);

	const handlers: InteractiveStateResult['handlers'] = {
		onMouseEnter: () => {
			if (!merged.disabled) setIsHovered(true);
		},
		onMouseLeave: () => {
			setIsHovered(false);
			setIsActive(false);
		},
		onFocus: (e) => {
			if ((e.currentTarget as Element).matches(':focus-visible')) {
				setIsFocusVisible(true);
			}
		},
		onBlur: () => {
			setIsFocusVisible(false);
			setIsActive(false);
		},
		onPointerDown: () => {
			if (!merged.disabled) setIsActive(true);
		},
		onPointerUp: () => {
			setIsActive(false);
		},
		onKeyDown: (e) => {
			if ((e.key === ' ' || e.key === 'Enter') && !merged.disabled) setIsActive(true);
		},
		onKeyUp: (e) => {
			if (e.key === ' ' || e.key === 'Enter') setIsActive(false);
		},
	};

	// Reactive data attributes — getters re-read signals on each access so
	// `{...state.dataAttributes}` stays reactive when spread in JSX.
	const dataAttributes: InteractiveStateResult['dataAttributes'] = {
		get 'data-hover'() {
			return isHovered() ? '' : undefined;
		},
		get 'data-focus-visible'() {
			return isFocusVisible() ? '' : undefined;
		},
		get 'data-active'() {
			return isActive() ? '' : undefined;
		},
		get 'data-disabled'() {
			return merged.disabled ? '' : undefined;
		},
	};

	return { handlers, dataAttributes, isHovered, isFocusVisible, isActive };
}
