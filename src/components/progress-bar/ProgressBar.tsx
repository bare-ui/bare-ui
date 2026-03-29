import React from 'react'
import type { ProgressBarProps } from './ProgressBar.types'

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
	({ percentage = 0, size = 'medium', className, ...rest }, ref) => {
		const clamped = Math.min(100, Math.max(0, percentage))

		return (
			<div
				ref={ref}
				className={className}
				role="progressbar"
				aria-valuenow={clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				data-size={size}
				{...rest}
			>
				<div data-part="fill" style={{ width: `${clamped}%` }} />
			</div>
		)
	},
)

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
