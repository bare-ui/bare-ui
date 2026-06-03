'use client';

import React, { createContext, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { mergeProps } from '@/utils/merge-props';
import type {
	ModalCloseProps,
	ModalContentProps,
	ModalContextValue,
	ModalOverlayProps,
	ModalPortalProps,
	ModalRootProps,
} from './Modal.types';

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new globalThis.Error('Modal compound components must be used within Modal.Root');
	}
	return context;
}

const Root: React.FC<ModalRootProps> = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) => {
	const [open, setOpen] = useControllableState({
		value: controlledOpen,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});

	useKeyboard({
		Escape: () => {
			if (open) setOpen(false);
		},
	});

	useScrollLock(open);

	return (
		<ModalContext.Provider value={{ open, onOpenChange: setOpen as (value: boolean) => void }}>
			{children}
		</ModalContext.Provider>
	);
};

Root.displayName = 'Modal.Root';

const Portal: React.FC<ModalPortalProps> = ({ children, container }) => {
	const { open } = useModalContext();

	if (!open) return null;
	// No DOM to portal into during SSR. Portals aren't rendered on the server
	// anyway; the content hydrates on the client once `document` exists.
	if (typeof document === 'undefined') return null;

	return createPortal(children, container || document.body);
};

Portal.displayName = 'Modal.Portal';

const Overlay = React.forwardRef<HTMLDivElement, ModalOverlayProps>(({ children, className, ...rest }, ref) => {
	const { open, onOpenChange } = useModalContext();

	return (
		<div
			ref={ref}
			className={className}
			data-state={open ? 'open' : 'closed'}
			onClick={() => onOpenChange(false)}
			{...rest}>
			{children}
		</div>
	);
});

Overlay.displayName = 'Modal.Overlay';

const Content = React.forwardRef<HTMLDivElement, ModalContentProps>(({ children, className, ...rest }, ref) => {
	const { open } = useModalContext();
	const internalRef = useRef<HTMLDivElement | null>(null);
	const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

	useFocusTrap(internalRef, { active: open });

	return (
		<div
			ref={mergedRef}
			role='dialog'
			aria-modal='true'
			tabIndex={-1}
			className={className}
			data-state={open ? 'open' : 'closed'}
			onClick={(e) => e.stopPropagation()}
			{...rest}>
			{children}
		</div>
	);
});

Content.displayName = 'Modal.Content';

const Close = React.forwardRef<HTMLButtonElement, ModalCloseProps>(({ children, className, ...rest }, ref) => {
	const { onOpenChange } = useModalContext();
	const { handlers, dataAttributes } = useInteractiveState();

	const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

	return (
		<button
			ref={ref}
			type='button'
			className={className}
			{...dataAttributes}
			{...merged}
			onClick={(e) => {
				onOpenChange(false);
				(rest.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
			}}>
			{children}
		</button>
	);
});

Close.displayName = 'Modal.Close';

export const Modal = {
	Root,
	Portal,
	Overlay,
	Content,
	Close,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Modal.*`).
export { Root, Portal, Overlay, Content, Close };
