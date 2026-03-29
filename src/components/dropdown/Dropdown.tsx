import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type {
	DropdownContextValue,
	DropdownMenuProps,
	DropdownRootProps,
	DropdownTriggerProps,
} from './Dropdown.types'

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
	const context = useContext(DropdownContext)
	if (!context) {
		throw new globalThis.Error('Dropdown compound components must be used within Dropdown.Root')
	}
	return context
}

const Root = React.forwardRef<HTMLDivElement, DropdownRootProps>(
	(
		{ open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...rest },
		ref,
	) => {
		const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
		const isControlled = controlledOpen !== undefined
		const open = isControlled ? controlledOpen : uncontrolledOpen

		const rootRef = useRef<HTMLDivElement>(null)
		const combinedRef = (ref as React.RefObject<HTMLDivElement | null>) || rootRef
		const internalRef = ref ? combinedRef : rootRef

		const handleOpenChange = useCallback(
			(value: boolean) => {
				if (!isControlled) {
					setUncontrolledOpen(value)
				}
				onOpenChange?.(value)
			},
			[isControlled, onOpenChange],
		)

		useClickOutside(internalRef, () => {
			if (open) {
				handleOpenChange(false)
			}
		})

		useEffect(() => {
			const handleEscape = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && open) {
					handleOpenChange(false)
				}
			}

			window.addEventListener('keyup', handleEscape)
			return () => window.removeEventListener('keyup', handleEscape)
		}, [open, handleOpenChange])

		return (
			<DropdownContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
				<div ref={internalRef} className={className} {...rest}>
					{children}
				</div>
			</DropdownContext.Provider>
		)
	},
)

Root.displayName = 'Dropdown.Root'

const Trigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
	({ children, className, ...rest }, ref) => {
		const { open, onOpenChange } = useDropdownContext()
		const { handlers, dataAttributes } = useInteractiveState()

		const merged = mergeProps(
			rest as Record<string, unknown>,
			handlers as Record<string, unknown>,
		)

		return (
			<button
				ref={ref}
				type="button"
				className={className}
				aria-expanded={open}
				data-state={open ? 'open' : 'closed'}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					onOpenChange(!open)
					;(
						rest.onClick as
							| ((e: React.MouseEvent<HTMLButtonElement>) => void)
							| undefined
					)?.(e)
				}}
			>
				{children}
			</button>
		)
	},
)

Trigger.displayName = 'Dropdown.Trigger'

const Menu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
	({ position, children, className, ...rest }, ref) => {
		const { open } = useDropdownContext()

		if (!open) return null

		return (
			<div
				ref={ref}
				role="menu"
				className={className}
				data-state={open ? 'open' : 'closed'}
				data-position={position}
				{...rest}
			>
				{children}
			</div>
		)
	},
)

Menu.displayName = 'Dropdown.Menu'

export const Dropdown = {
	Root,
	Trigger,
	Menu,
}
