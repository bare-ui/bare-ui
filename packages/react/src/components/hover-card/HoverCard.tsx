'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import type {
	HoverCardContentProps,
	HoverCardContextValue,
	HoverCardRootProps,
	HoverCardSide,
	HoverCardTriggerProps,
} from './HoverCard.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
	const ctx = useContext(HoverCardContext);
	if (!ctx) throw new globalThis.Error('HoverCard sub-components must be used within HoverCard.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = ({
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	openDelay = 300,
	closeDelay = 200,
}: HoverCardRootProps) => {
	const [open, setOpen] = useControllableState({
		value: controlledOpen,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});

	const openTimer = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
	const closeTimer = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

	const clearTimers = useCallback(() => {
		if (openTimer.current) globalThis.clearTimeout(openTimer.current);
		if (closeTimer.current) globalThis.clearTimeout(closeTimer.current);
		openTimer.current = null;
		closeTimer.current = null;
	}, []);

	useEffect(() => clearTimers, [clearTimers]);

	const scheduleOpen = useCallback(() => {
		if (closeTimer.current) globalThis.clearTimeout(closeTimer.current);
		closeTimer.current = null;
		if (openTimer.current) return;
		openTimer.current = globalThis.setTimeout(() => {
			openTimer.current = null;
			setOpen(true);
		}, openDelay);
	}, [openDelay, setOpen]);

	const scheduleClose = useCallback(() => {
		if (openTimer.current) globalThis.clearTimeout(openTimer.current);
		openTimer.current = null;
		if (closeTimer.current) return;
		closeTimer.current = globalThis.setTimeout(() => {
			closeTimer.current = null;
			setOpen(false);
		}, closeDelay);
	}, [closeDelay, setOpen]);

	const openNow = useCallback(() => {
		clearTimers();
		setOpen(true);
	}, [clearTimers, setOpen]);

	const closeNow = useCallback(() => {
		clearTimers();
		setOpen(false);
	}, [clearTimers, setOpen]);

	const ctx = useMemo<HoverCardContextValue>(
		() => ({ open, scheduleOpen, scheduleClose, openNow, closeNow }),
		[open, scheduleOpen, scheduleClose, openNow, closeNow],
	);

	return (
		<HoverCardContext.Provider value={ctx}>
			<span style={{ position: 'relative', display: 'inline-block' }}>{children}</span>
		</HoverCardContext.Provider>
	);
};

Root.displayName = 'HoverCard.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLSpanElement, HoverCardTriggerProps>(
	({ children, onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, ...rest }, ref) => {
		const ctx = useHoverCardContext();
		return (
			<span
				ref={ref}
				data-state={ctx.open ? 'open' : 'closed'}
				{...rest}
				onMouseEnter={(e) => {
					ctx.scheduleOpen();
					onMouseEnter?.(e);
				}}
				onMouseLeave={(e) => {
					ctx.scheduleClose();
					onMouseLeave?.(e);
				}}
				onFocus={(e) => {
					ctx.openNow();
					onFocus?.(e);
				}}
				onBlur={(e) => {
					ctx.closeNow();
					onBlur?.(e);
				}}
				onKeyDown={(e) => {
					// APG: Escape dismisses the hover card while the trigger is focused.
					if (e.key === 'Escape' && ctx.open) ctx.closeNow();
					onKeyDown?.(e);
				}}>
				{children}
			</span>
		);
	},
);

Trigger.displayName = 'HoverCard.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function positionFor(side: HoverCardSide, offset: number): React.CSSProperties {
	switch (side) {
		case 'top':
			return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: offset };
		case 'bottom':
			return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: offset };
		case 'left':
			return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: offset };
		case 'right':
			return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: offset };
	}
}

const Content = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
	({ side = 'bottom', sideOffset = 8, forceMount = false, className, children, style, onMouseEnter, onMouseLeave, ...rest }, ref) => {
		const ctx = useHoverCardContext();
		if (!forceMount && !ctx.open) return null;

		return (
			<div
				ref={ref}
				role='dialog'
				hidden={forceMount && !ctx.open ? true : undefined}
				data-state={ctx.open ? 'open' : 'closed'}
				data-side={side}
				className={className}
				style={{ position: 'absolute', zIndex: 50, ...positionFor(side, sideOffset), ...style }}
				{...rest}
				onMouseEnter={(e) => {
					ctx.scheduleOpen();
					onMouseEnter?.(e);
				}}
				onMouseLeave={(e) => {
					ctx.scheduleClose();
					onMouseLeave?.(e);
				}}>
				{children}
			</div>
		);
	},
);

Content.displayName = 'HoverCard.Content';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const HoverCard = {
	Root,
	Trigger,
	Content,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `HoverCard.*`).
export { Root, Trigger, Content };
