import React from 'react';
import type { SpinnerProps } from './Spinner.types';

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
	({ label = 'Loading', decorative = true, className, children, ...rest }, ref) => (
		<span
			ref={ref}
			role='status'
			aria-live='polite'
			aria-label={label}
			className={className}
			{...rest}>
			<span aria-hidden={decorative ? 'true' : undefined}>{children}</span>
			<span style={visuallyHidden}>{label}</span>
		</span>
	),
);
Spinner.displayName = 'Spinner';

const visuallyHidden: React.CSSProperties = {
	position: 'absolute',
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: 'hidden',
	clip: 'rect(0,0,0,0)',
	whiteSpace: 'nowrap',
	borderWidth: 0,
};

export { Spinner };
