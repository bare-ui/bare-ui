import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInteractiveState } from '@/hooks/use-interactive-state'
import { mergeProps } from '@/utils/merge-props'
import type {
	ModalCloseProps,
	ModalContentProps,
	ModalContextValue,
	ModalOverlayProps,
	ModalPortalProps,
	ModalRootProps,
} from './Modal.types'

const ModalContext = createContext<ModalContextValue | null>(null)

function useModalContext() {
	const context = useContext(ModalContext)
	if (!context) {
		throw new globalThis.Error('Modal compound components must be used within Modal.Root')
	}
	return context
}

const Root: React.FC<ModalRootProps> = ({
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
		<ModalContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
			{children}
		</ModalContext.Provider>
	)
}

Root.displayName = 'Modal.Root'

const Portal: React.FC<ModalPortalProps> = ({ children, container }) => {
	const { open } = useModalContext()

	if (!open) return null

	return createPortal(children, container || document.body)
}

Portal.displayName = 'Modal.Portal'

const Overlay = React.forwardRef<HTMLDivElement, ModalOverlayProps>(
	({ children, className, ...rest }, ref) => {
		const { open, onOpenChange } = useModalContext()

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

Overlay.displayName = 'Modal.Overlay'

const Content = React.forwardRef<HTMLDivElement, ModalContentProps>(
	({ children, className, ...rest }, ref) => {
		const { open } = useModalContext()

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

Content.displayName = 'Modal.Content'

const Close = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
	({ children, className, ...rest }, ref) => {
		const { onOpenChange } = useModalContext()
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

Close.displayName = 'Modal.Close'

export const Modal = {
	Root,
	Portal,
	Overlay,
	Content,
	Close,
}
