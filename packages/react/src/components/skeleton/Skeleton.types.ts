import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	/** When false, render children instead of the skeleton (handy for conditional loading). */
	loading?: boolean;
}
