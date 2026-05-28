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
	DrawerCloseProps,
	DrawerContentProps,
	DrawerContextValue,
	DrawerHeaderProps,
	DrawerOverlayProps,
	DrawerPortalProps,
	DrawerRootProps,
} from './Drawer.types';

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
	const context = useContext(DrawerContext);
	if (!context) {
		throw new globalThis.Error('Drawer compound components must be used within Drawer.Root');
	}
	return context;
}

const Root: React.FC<DrawerRootProps> = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) => {
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
		<DrawerContext.Provider value={{ open, onOpenChange: setOpen as (value: boolean) => void }}>
			{children}
		</DrawerContext.Provider>
	);
};

Root.displayName = 'Drawer.Root';

const Portal: React.FC<DrawerPortalProps> = ({ children, container }) => {
	const { open } = useDrawerContext();

	if (!open) return null;

	return createPortal(children, container || document.body);
};

Portal.displayName = 'Drawer.Portal';

const Overlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(({ children, className, ...rest }, ref) => {
	const { open, onOpenChange } = useDrawerContext();

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

Overlay.displayName = 'Drawer.Overlay';

const Content = React.forwardRef<HTMLDivElement, DrawerContentProps>(({ children, className, ...rest }, ref) => {
	const { open } = useDrawerContext();
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

Content.displayName = 'Drawer.Content';

const Header = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(({ children, className, ...rest }, ref) => {
	return (
		<div
			ref={ref}
			className={className}
			{...rest}>
			{children}
		</div>
	);
});

Header.displayName = 'Drawer.Header';

const Close = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(({ children, className, ...rest }, ref) => {
	const { onOpenChange } = useDrawerContext();
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

Close.displayName = 'Drawer.Close';

export const Drawer = {
	Root,
	Portal,
	Overlay,
	Content,
	Header,
	Close,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Drawer.*`).
export { Root, Portal, Overlay, Content, Header, Close };
