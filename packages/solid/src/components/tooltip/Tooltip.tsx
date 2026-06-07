import { createContext, createUniqueId, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createTimeout } from '@/primitives/create-timeout';
import type {
	TooltipContentProps,
	TooltipContextValue,
	TooltipRootProps,
	TooltipTriggerProps,
} from './Tooltip.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TooltipContext = createContext<TooltipContextValue>({
	open: false,
	setOpen: () => {},
	contentId: '',
});

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: TooltipRootProps) {
	const [open, setOpenState] = createControllableState<boolean>({
		get value() {
			return props.open;
		},
		defaultValue: props.defaultOpen ?? false,
		get onChange() {
			return props.onOpenChange;
		},
	});

	const { start, stop } = createTimeout(() => setOpenState(true), () => props.delayDuration ?? 300, {
		autoStart: false,
	});

	const contentId = `tooltip-${createUniqueId()}`;

	const setOpen = (value: boolean) => {
		if (value) {
			start();
		} else {
			stop();
			setOpenState(false);
		}
	};

	const ctxValue: TooltipContextValue = {
		get open() {
			return !!open();
		},
		setOpen,
		contentId,
	};

	return (
		<TooltipContext.Provider value={ctxValue}>
			<span style={{ position: 'relative', display: 'inline-block' }}>{props.children}</span>
		</TooltipContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: TooltipTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur']);
	const ctx = useContext(TooltipContext);

	const callUserHandler = <E,>(handler: unknown, e: E) => {
		if (typeof handler === 'function') (handler as (event: E) => void)(e);
	};

	const handleMouseEnter: JSX.EventHandler<HTMLSpanElement, MouseEvent> = (e) => {
		ctx.setOpen(true);
		callUserHandler(local.onMouseEnter, e);
	};
	const handleMouseLeave: JSX.EventHandler<HTMLSpanElement, MouseEvent> = (e) => {
		ctx.setOpen(false);
		callUserHandler(local.onMouseLeave, e);
	};
	const handleFocus: JSX.EventHandler<HTMLSpanElement, FocusEvent> = (e) => {
		ctx.setOpen(true);
		callUserHandler(local.onFocus, e);
	};
	const handleBlur: JSX.EventHandler<HTMLSpanElement, FocusEvent> = (e) => {
		ctx.setOpen(false);
		callUserHandler(local.onBlur, e);
	};

	return (
		<span
			aria-describedby={ctx.contentId}
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

function Content(props: TooltipContentProps) {
	const [local, rest] = splitProps(props, ['side', 'class', 'children', 'style', 'id']);
	const ctx = useContext(TooltipContext);
	const side = () => local.side ?? 'top';

	const positionStyle = (): JSX.CSSProperties => {
		const s = side();
		const base: JSX.CSSProperties = {
			position: 'absolute',
			'z-index': 50,
			'pointer-events': 'none',
		};
		if (s === 'top') {
			return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', 'margin-bottom': '8px' };
		}
		if (s === 'bottom') {
			return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', 'margin-top': '8px' };
		}
		if (s === 'left') {
			return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', 'margin-right': '8px' };
		}
		return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', 'margin-left': '8px' };
	};

	const mergedStyle = () => {
		const userStyle = local.style;
		if (typeof userStyle === 'string' || !userStyle) return positionStyle();
		return { ...positionStyle(), ...(userStyle as JSX.CSSProperties) };
	};

	return (
		<span
			id={local.id ?? ctx.contentId}
			role='tooltip'
			data-state={ctx.open ? 'open' : 'closed'}
			data-side={side()}
			class={local.class}
			style={mergedStyle()}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Tooltip = { Root, Trigger, Content };

export { Root, Trigger, Content };
