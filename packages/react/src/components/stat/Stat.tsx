import React from 'react';
import type {
	StatDeltaProps,
	StatDirection,
	StatHelpTextProps,
	StatLabelProps,
	StatRootProps,
	StatSparklineProps,
	StatValueProps,
} from './Stat.types';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, StatRootProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		role='group'
		className={className}
		{...rest}>
		{children}
	</div>
));

Root.displayName = 'Stat.Root';

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

const Label = React.forwardRef<HTMLSpanElement, StatLabelProps>(({ className, children, ...rest }, ref) => (
	<span
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</span>
));

Label.displayName = 'Stat.Label';

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

const Value = React.forwardRef<HTMLSpanElement, StatValueProps>(({ className, children, ...rest }, ref) => (
	<span
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</span>
));

Value.displayName = 'Stat.Value';

// ---------------------------------------------------------------------------
// Delta
// ---------------------------------------------------------------------------

function resolveDirection(value: number | undefined, direction: StatDirection | undefined): StatDirection {
	if (direction) return direction;
	if (value === undefined) return 'neutral';
	if (value > 0) return 'increase';
	if (value < 0) return 'decrease';
	return 'neutral';
}

const Delta = React.forwardRef<HTMLSpanElement, StatDeltaProps>(
	({ value, direction, className, children, ...rest }, ref) => {
		const resolved = resolveDirection(value, direction);
		return (
			<span
				ref={ref}
				className={className}
				data-direction={resolved}
				{...rest}>
				{children ?? (value !== undefined ? value : null)}
			</span>
		);
	},
);

Delta.displayName = 'Stat.Delta';

// ---------------------------------------------------------------------------
// HelpText
// ---------------------------------------------------------------------------

const HelpText = React.forwardRef<HTMLSpanElement, StatHelpTextProps>(({ className, children, ...rest }, ref) => (
	<span
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</span>
));

HelpText.displayName = 'Stat.HelpText';

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

const Sparkline = React.forwardRef<SVGSVGElement, StatSparklineProps>(
	({ data, width = 100, height = 24, strokeWidth = 1.5, className, ...rest }, ref) => {
		if (data.length < 2) return null;

		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min;
		const stepX = width / (data.length - 1);
		// Inset by half the stroke so the line never clips at the edges.
		const pad = strokeWidth / 2;
		const usableHeight = height - strokeWidth;

		const points = data
			.map((v, i) => {
				const x = i * stepX;
				const y = span === 0 ? height / 2 : pad + usableHeight - ((v - min) / span) * usableHeight;
				return `${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');

		return (
			<svg
				ref={ref}
				viewBox={`0 0 ${width} ${height}`}
				width={width}
				height={height}
				preserveAspectRatio='none'
				aria-hidden='true'
				className={className}
				{...rest}>
				<polyline
					points={points}
					fill='none'
					stroke='currentColor'
					strokeWidth={strokeWidth}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		);
	},
);

Sparkline.displayName = 'Stat.Sparkline';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Stat = {
	Root,
	Label,
	Value,
	Delta,
	HelpText,
	Sparkline,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Stat.*`).
export { Root, Label, Value, Delta, HelpText, Sparkline };
