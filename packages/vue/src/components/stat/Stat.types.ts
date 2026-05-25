export type StatDirection = 'increase' | 'decrease' | 'neutral';

export interface StatRootProps {
	class?: string;
}

export interface StatLabelProps {
	class?: string;
}

export interface StatValueProps {
	class?: string;
	/** Numeric or text value — renders when there are no children. */
	value?: number | string;
}

export interface StatDeltaProps {
	class?: string;
	/** Numeric change — its sign derives `direction` when `direction` is omitted, and renders when there are no children. */
	value?: number;
	/** Force the direction; otherwise inferred from `value`. */
	direction?: StatDirection;
}

export interface StatHelpTextProps {
	class?: string;
}

export interface StatSparklineProps {
	class?: string;
	/** Series of values to plot. */
	data: number[];
	/** Viewport width in px. Default `100`. */
	width?: number;
	/** Viewport height in px. Default `24`. */
	height?: number;
	/** Stroke width of the line. Default `1.5`. */
	strokeWidth?: number;
}
