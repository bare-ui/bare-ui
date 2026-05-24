import React from 'react';

export type StatDirection = 'increase' | 'decrease' | 'neutral';

export type StatRootProps = React.HTMLAttributes<HTMLDivElement>;

export type StatLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export type StatValueProps = React.HTMLAttributes<HTMLSpanElement>;

export interface StatDeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** Numeric change — its sign derives `direction` when `direction` is omitted, and renders when there are no children. */
	value?: number;
	/** Force the direction; otherwise inferred from `value`. */
	direction?: StatDirection;
}

export type StatHelpTextProps = React.HTMLAttributes<HTMLSpanElement>;

export interface StatSparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
	/** Series of values to plot. */
	data: number[];
	/** Viewport width in px. Default `100`. */
	width?: number;
	/** Viewport height in px. Default `24`. */
	height?: number;
	/** Stroke width of the line. Default `1.5`. */
	strokeWidth?: number;
}
