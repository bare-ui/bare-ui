import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type {
	DrawerCloseProps,
	DrawerContentProps,
	DrawerContextValue,
	DrawerHeaderProps,
	DrawerOverlayProps,
	DrawerPortalProps,
	DrawerRootProps,
} from './Drawer.types'

const DrawerContext = createContext<DrawerContextValue | null>(null)

function useDrawerContext() {
	const context = useContext(DrawerContext)
	if (!context) {
		throw new globalThis.Error('Drawer compound components must be used within Drawer.Root')
	}
	return context
}

const Root: React.FC<DrawerRootProps> = ({
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	children,
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen

	const handleOpenChange = useCallback(
		(value: boolean) => {
			if (!isControlled) {
				setUncontrolledOpen(value)
			}
			onOpenChange?.(value)
		},
		[isControlled, onOpenChange],
	)

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && open) {
				handleOpenChange(false)
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [open, handleOpenChange])

	return (
		<DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
			{children}
		</DrawerContext.Provider>
	)
}

Root.displayName = 'Drawer.Root'

const Portal: React.FC<DrawerPortalProps> = ({ children, container }) => {
	const { open } = useDrawerContext()

	if (!open) return null

	return createPortal(children, container || document.body)
}

Portal.displayName = 'Drawer.Portal'

const Overlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
	({ children, className, ...rest }, ref) => {
		const { open, onOpenChange } = useDrawerContext()

		return (
			<div
				ref={ref}
				className={className}
				data-state={open ? 'open' : 'closed'}
				onClick={() => onOpenChange(false)}
				{...rest}
			>
				{children}
			</div>
		)
	},
)

Overlay.displayName = 'Drawer.Overlay'

const Content = React.forwardRef<HTMLDivElement, DrawerContentProps>(
	({ children, className, ...rest }, ref) => {
		const { open } = useDrawerContext()

		return (
			<div
				ref={ref}
				role="dialog"
				aria-modal="true"
				className={className}
				data-state={open ? 'open' : 'closed'}
				onClick={(e) => e.stopPropagation()}
				{...rest}
			>
				{children}
			</div>
		)
	},
)

Content.displayName = 'Drawer.Content'

const Header = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
	({ children, className, ...rest }, ref) => {
		return (
			<div ref={ref} className={className} {...rest}>
				{children}
			</div>
		)
	},
)

Header.displayName = 'Drawer.Header'

const Close = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
	({ children, className, ...rest }, ref) => {
		const { onOpenChange } = useDrawerContext()
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
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					onOpenChange(false)
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

Close.displayName = 'Drawer.Close'

export const Drawer = {
	Root,
	Portal,
	Overlay,
	Content,
	Header,
	Close,
}
