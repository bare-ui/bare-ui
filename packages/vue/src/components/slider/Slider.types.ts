export type SliderOrientation = 'horizontal' | 'vertical';

/** Internal value stored as an array — single is `[v]`, range is `[a, b]`. */
export type SliderValue = number[];

interface SliderBaseProps {
	/** Minimum value. */
	min?: number;
	/** Maximum value. */
	max?: number;
	/** Step increment. */
	step?: number;
	/** Layout orientation. */
	orientation?: SliderOrientation;
	/** Disable the slider. */
	disabled?: boolean;
	/** Inverted (right-to-left or top-to-bottom). */
	inverted?: boolean;
	/** Optional human-readable label for ARIA. */
	'aria-label'?: string;
	class?: string;
}

export interface SliderSingleProps extends SliderBaseProps {
	/** Two-thumb range mode off. */
	range?: false;
	/** Controlled value. */
	value?: number;
	/** Initial value (uncontrolled). */
	defaultValue?: number;
	/** Called when the value changes. */
	onChange?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
	/** Enable two-thumb range mode. */
	range: true;
	/** Controlled value `[start, end]`. */
	value?: [number, number];
	/** Initial value (uncontrolled). */
	defaultValue?: [number, number];
	/** Called when either thumb moves. */
	onChange?: (value: [number, number]) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

/**
 * Flattened prop shape used internally by the component and by Storybook's
 * vue-docgen (which can't introspect the {@link SliderProps} union). The four
 * mode-specific props below must mirror {@link SliderSingleProps} / {@link SliderRangeProps}.
 */
export interface SliderImplProps extends SliderBaseProps {
	/** Enable two-thumb range mode. With `range`, `value` becomes `[start, end]`. */
	range?: boolean;
	/** Controlled value — a number in single mode, `[start, end]` in range mode. */
	value?: number | [number, number];
	/** Initial value, uncontrolled — a number in single mode, `[start, end]` in range mode. */
	defaultValue?: number | [number, number];
	/** Called when the value changes. */
	onChange?: (value: number | [number, number]) => void;
}
