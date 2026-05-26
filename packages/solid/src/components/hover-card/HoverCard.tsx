import { createContext, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createTimeout } from '@/primitives/create-timeout';
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
	if (!ctx) throw new Error('HoverCard sub-components must be used within HoverCard.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: HoverCardRootProps) {
	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return props.open;
		},
		defaultValue: props.defaultOpen ?? false,
		get onChange() {
			return props.onOpenChange;
		},
	});

	const openTimer = createTimeout(() => setOpen(true), () => props.openDelay ?? 300, { autoStart: false });
	const closeTimer = createTimeout(() => setOpen(false), () => props.closeDelay ?? 200, { autoStart: false });

	const scheduleOpen = () => {
		closeTimer.stop();
		if (openTimer.isPending()) return;
		openTimer.start();
	};

	const scheduleClose = () => {
		openTimer.stop();
		if (closeTimer.isPending()) return;
		closeTimer.start();
	};

	const openNow = () => {
		openTimer.stop();
		closeTimer.stop();
		setOpen(true);
	};

	const closeNow = () => {
		openTimer.stop();
		closeTimer.stop();
		setOpen(false);
	};

	const ctxValue: HoverCardContextValue = {
		get open() {
			return !!open();
		},
		scheduleOpen,
		scheduleClose,
		openNow,
		closeNow,
	};

	return (
		<HoverCardContext.Provider value={ctxValue}>
			<span style={{ position: 'relative', display: 'inline-block' }}>{props.children}</span>
		</HoverCardContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: HoverCardTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur']);
	const ctx = useHoverCardContext();

	const callUserHandler = <E,>(handler: unknown, e: E) => {
		if (typeof handler === 'function') (handler as (event: E) => void)(e);
	};

	// Compose consumer-provided handlers with our internal ones — the consumer's
	// fires first, then ours.
	const handleMouseEnter: JSX.EventHandler<HTMLSpanElement, MouseEvent> = (e) => {
		callUserHandler(local.onMouseEnter, e);
		ctx.scheduleOpen();
	};
	const handleMouseLeave: JSX.EventHandler<HTMLSpanElement, MouseEvent> = (e) => {
		callUserHandler(local.onMouseLeave, e);
		ctx.scheduleClose();
	};
	const handleFocus: JSX.EventHandler<HTMLSpanElement, FocusEvent> = (e) => {
		callUserHandler(local.onFocus, e);
		ctx.openNow();
	};
	const handleBlur: JSX.EventHandler<HTMLSpanElement, FocusEvent> = (e) => {
		callUserHandler(local.onBlur, e);
		ctx.closeNow();
	};

	return (
		<span
			data-state={ctx.open ? 'open' : 'closed'}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function positionFor(side: HoverCardSide, offset: number): JSX.CSSProperties {
	const px = `${offset}px`;
	switch (side) {
		case 'top':
			return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', 'margin-bottom': px };
		case 'bottom':
			return { top: '100%', left: '50%', transform: 'translateX(-50%)', 'margin-top': px };
		case 'left':
			return { right: '100%', top: '50%', transform: 'translateY(-50%)', 'margin-right': px };
		case 'right':
			return { left: '100%', top: '50%', transform: 'translateY(-50%)', 'margin-left': px };
	}
}

function Content(props: HoverCardContentProps) {
	const [local, rest] = splitProps(props, [
		'side',
		'sideOffset',
		'forceMount',
		'class',
		'children',
		'style',
		'onMouseEnter',
		'onMouseLeave',
	]);
	const ctx = useHoverCardContext();

	const side = () => local.side ?? 'bottom';
	const sideOffset = () => local.sideOffset ?? 8;

	const baseStyle = (): JSX.CSSProperties => ({
		position: 'absolute',
		'z-index': 50,
		...positionFor(side(), sideOffset()),
	});

	const mergedStyle = () => {
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return baseStyle();
		return { ...baseStyle(), ...(userStyle as JSX.CSSProperties) };
	};

	const callUserHandler = <E,>(handler: unknown, e: E) => {
		if (typeof handler === 'function') (handler as (event: E) => void)(e);
	};

	const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		callUserHandler(local.onMouseEnter, e);
		ctx.scheduleOpen();
	};
	const handleMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		callUserHandler(local.onMouseLeave, e);
		ctx.scheduleClose();
	};

	return (
		<Show when={local.forceMount || ctx.open}>
			<div
				role='dialog'
				hidden={local.forceMount && !ctx.open ? true : undefined}
				data-state={ctx.open ? 'open' : 'closed'}
				data-side={side()}
				class={local.class}
				style={mergedStyle()}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const HoverCard = {
	Root,
	Trigger,
	Content,
};
