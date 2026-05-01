import React from 'react';
import type { SkeletonProps } from './Skeleton.types';

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
	({ loading = true, className, children, 'aria-label': ariaLabel = 'Loading', ...rest }, ref) => {
		if (!loading) return <>{children}</>;

		return (
			<div
				ref={ref}
				role='status'
				aria-busy='true'
				aria-live='polite'
				aria-label={ariaLabel}
				className={className}
				data-loading=''
				{...rest}
			/>
		);
	},
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
