import React from 'react';

export type SliderOrientation = 'horizontal' | 'vertical';

/** Internal value stored as an array — single is `[v]`, range is `[a, b]`. */
export type SliderValue = number[];

interface SliderBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
