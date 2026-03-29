import React from 'react';
import type { BadgeProps } from './Badge.types';

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ count = 0, className, ...rest }, ref) => {
	const displayCount =
		count > 0 ?
			count > 9 ?
				'9+'
			:	count
		:	0;

	return (
		<span
			ref={ref}
			className={className}
			data-count={count}
			{...rest}>
			{displayCount}
		</span>
	);
});

Badge.displayName = 'Badge';

export { Badge };
