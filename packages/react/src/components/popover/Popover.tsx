import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	PopoverCloseProps,
	PopoverContentProps,
	PopoverContextValue,
	PopoverRootProps,
	PopoverTriggerProps,
} from './Popover.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
	const context = useContext(PopoverContext);
	if (!context) {
		throw new globalThis.Error('Popover compound components must be used within Popover.Root');
	}
	return context;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, PopoverRootProps>(
	(
		{
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			closeOnOutsideClick = true,
			closeOnEscape = true,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
		const isControlled = controlledOpen !== undefined;
		const open = isControlled ? controlledOpen : uncontrolledOpen;

		const internalRef = useRef<HTMLDivElement | null>(null);
		const setMergedRef = (el: HTMLDivElement | null) => {
			internalRef.current = el;
			if (typeof ref === 'function') ref(el);
			else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
		};

		const setOpen = useCallback(
			(value: boolean) => {
				if (!isControlled) setUncontrolledOpen(value);
				onOpenChange?.(value);
			},
			[isControlled, onOpenChange],
		);

		useClickOutside(internalRef, () => {
			if (open && closeOnOutsideClick) setOpen(false);
		});

		useEffect(() => {
			if (!closeOnEscape) return;
			const handle = (e: KeyboardEvent) => {
				if (e.key === 'Escape' && open) setOpen(false);
			};
			window.addEventListener('keyup', handle);
			return () => window.removeEventListener('keyup', handle);
		}, [open, setOpen, closeOnEscape]);

		const triggerId = useId();
		const contentId = useId();

		const ctx = useMemo<PopoverContextValue>(
			() => ({ open, setOpen, triggerId, contentId }),
			[open, setOpen, triggerId, contentId],
		);

		return (
			<PopoverContext.Provider value={ctx}>
				<div
					ref={setMergedRef}
					className={className}
					data-state={open ? 'open' : 'closed'}
					{...rest}>
					{children}
				</div>
			</PopoverContext.Provider>
		);
	},
);
Root.displayName = 'Popover.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const { open, setOpen, triggerId, contentId } = usePopoverContext();
		const { handlers, dataAttributes } = useInteractiveState();
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				id={triggerId}
				type='button'
				className={className}
				aria-haspopup='dialog'
				aria-expanded={open}
				aria-controls={contentId}
				data-state={open ? 'open' : 'closed'}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					setOpen(!open);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'Popover.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, PopoverContentProps>(
	({ side = 'bottom', align = 'center', forceMount = false, className, children, ...rest }, ref) => {
		const { open, triggerId, contentId } = usePopoverContext();

		if (!open && !forceMount) return null;

		return (
			<div
				ref={ref}
				id={contentId}
				role='dialog'
				aria-labelledby={triggerId}
				className={className}
				hidden={!open && forceMount ? true : undefined}
				data-state={open ? 'open' : 'closed'}
				data-side={side}
				data-align={align}
				{...rest}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'Popover.Content';

// ---------------------------------------------------------------------------
// Close
// ---------------------------------------------------------------------------

const Close = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const { setOpen } = usePopoverContext();
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
					setOpen(false);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Close.displayName = 'Popover.Close';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Popover = { Root, Trigger, Content, Close };
