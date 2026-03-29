import React from 'react';
import type { SpinnerProps } from './Spinner.types';

const DOT_COUNT = 12;

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
	({ size = 'medium', color, className, style, ...rest }, ref) => {
		const mergedStyle: React.CSSProperties =
			color ? ({ ...style, '--spinner-color': color } as React.CSSProperties) : { ...style };

		return (
			<div
				ref={ref}
				className={className}
				role='status'
				aria-label='Loading'
				data-size={size}
				style={mergedStyle}
				{...rest}>
				{Array.from({ length: DOT_COUNT }, (_, i) => (
					<div
						key={i}
						data-part='dot'
					/>
				))}
			</div>
		);
	},
);

Spinner.displayName = 'Spinner';

export { Spinner };
