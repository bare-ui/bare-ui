import type { JSX } from 'solid-js';

export type StatDirection = 'increase' | 'decrease' | 'neutral';

export type StatRootProps = JSX.HTMLAttributes<HTMLDivElement>;

export type StatLabelProps = JSX.HTMLAttributes<HTMLSpanElement>;

export type StatValueProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface StatDeltaProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Numeric change — its sign derives `direction` when `direction` is omitted, and renders when there are no children. */
	value?: number;
	/** Force the direction; otherwise inferred from `value`. */
	direction?: StatDirection;
}

export type StatHelpTextProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface StatSparklineProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'children'> {
	/** Series of values to plot. */
	data: number[];
	/** Viewport width in px. Default `100`. */
	width?: number;
	/** Viewport height in px. Default `24`. */
	height?: number;
	/** Stroke width of the line. Default `1.5`. */
	strokeWidth?: number;
}
