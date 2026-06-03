'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
		const [open, setOpenState] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});

		const internalRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

		const setOpen = useCallback((value: boolean) => setOpenState(value), [setOpenState]);

		useClickOutside(internalRef, () => {
			if (open && closeOnOutsideClick) setOpen(false);
		});

		useKeyboard(
			{
				Escape: () => {
					if (open) setOpen(false);
				},
			},
			{ event: 'keydown', enabled: open && closeOnEscape },
		);

		const triggerId = useId('popover-trigger');
		const contentId = useId('popover-content');

		const ctx = useMemo<PopoverContextValue>(
			() => ({ open, setOpen, triggerId, contentId }),
			[open, setOpen, triggerId, contentId],
		);

		return (
			<PopoverContext.Provider value={ctx}>
				<div
					ref={mergedRef}
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
		const contentRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(contentRef, ref);

		// Non-modal dialog: move focus into the popover on open and restore it to
		// the trigger on close, but let Tab leave naturally (trap: false).
		useFocusTrap(contentRef, { active: open, trap: false });

		if (!open && !forceMount) return null;

		return (
			<div
				ref={mergedRef}
				id={contentId}
				role='dialog'
				aria-labelledby={triggerId}
				tabIndex={-1}
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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Popover.*`).
export { Root, Trigger, Content, Close };
