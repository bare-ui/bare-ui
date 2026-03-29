import React from 'react'
import type { ListProps } from './List.types'

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
	({ isOrdered = false, type, size, className, children, ...rest }, ref) => {
		const Tag = isOrdered ? 'ol' : 'ul'

		return (
			<Tag
				ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
				className={className}
				data-type={type}
				data-size={size}
				data-striped={type === 'striped' ? '' : undefined}
				data-divider={type === 'divider' ? '' : undefined}
				{...rest}
			>
				{children}
			</Tag>
		)
	},
)

List.displayName = 'List'

export { List }
