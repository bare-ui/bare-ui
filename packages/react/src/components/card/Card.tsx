import React from 'react';
import type { CardProps } from './Card.types';

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ color, size, className, children, ...rest }, ref) => {
	return (
		<div
			ref={ref}
			className={className}
			data-color={color}
			data-size={size}
			{...rest}>
			{children}
		</div>
	);
});

Card.displayName = 'Card';

export { Card };
