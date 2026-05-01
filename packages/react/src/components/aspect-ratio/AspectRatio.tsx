import React from 'react';
import type { AspectRatioProps } from './AspectRatio.types';

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
	({ ratio = 1, children, style, className, ...rest }, ref) => {
		return (
			<div
				ref={ref}
				className={className}
				data-ratio={ratio}
				style={{ position: 'relative', width: '100%', aspectRatio: String(ratio), ...style }}
				{...rest}>
				{children}
			</div>
		);
	},
);
AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
