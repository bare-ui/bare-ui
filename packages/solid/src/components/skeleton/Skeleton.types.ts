import type { JSX } from 'solid-js';

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** When false, render children instead of the skeleton (handy for conditional loading). */
	loading?: boolean;
}
