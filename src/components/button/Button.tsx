import React from 'react'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type { ButtonProps } from './Button.types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			asChild = false,
			disabled = false,
			autoFocus = false,
			type = 'button',
			children,
			...rest
		},
		ref,
	) => {
		const { handlers, dataAttributes } = useInteractiveState({ disabled })

		const sharedProps = {
			...mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>),
			...dataAttributes,
			'data-autofocus': autoFocus || undefined,
		}

		if (asChild && React.isValidElement(children)) {
			const child = children as React.ReactElement<Record<string, unknown>>
			// eslint-disable-next-line react-hooks/refs -- forwarding a ref via cloneElement is valid
			return React.cloneElement(child, { ref, ...mergeProps(child.props, sharedProps) })
		}

		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled}
				autoFocus={autoFocus}
				{...sharedProps}
			>
				{children}
			</button>
		)
	},
)

Button.displayName = 'Button'

export { Button }
