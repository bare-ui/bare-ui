import { createContext, Show, splitProps, useContext, type JSX } from 'solid-js';
import { Portal as SolidPortal } from 'solid-js/web';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createFocusTrap } from '@/primitives/create-focus-trap';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { createScrollLock } from '@/primitives/create-scroll-lock';
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
		throw new Error('Drawer compound components must be used within Drawer.Root');
	}
	return context;
}

function Root(props: DrawerRootProps) {
	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return props.open;
		},
		defaultValue: props.defaultOpen ?? false,
		onChange: props.onOpenChange,
	});

	createKeyboard({
		Escape: () => {
			if (open()) setOpen(false);
		},
	});

	createScrollLock(() => open());

	const ctxValue: DrawerContextValue = {
		get open() {
			return open();
		},
		onOpenChange: (value: boolean) => setOpen(value),
	};

	return <DrawerContext.Provider value={ctxValue}>{props.children}</DrawerContext.Provider>;
}

function Portal(props: DrawerPortalProps) {
	const ctx = useDrawerContext();

	return (
		<Show when={ctx.open}>
			<SolidPortal mount={props.container}>{props.children}</SolidPortal>
		</Show>
	);
}

function Overlay(props: DrawerOverlayProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useDrawerContext();

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		ctx.onOpenChange(false);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</div>
	);
}

function Content(props: DrawerContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick', 'ref']);
	const ctx = useDrawerContext();
	let contentEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (contentEl = el),
		local.ref as ((el: HTMLDivElement) => void) | undefined,
	);

	createFocusTrap(() => contentEl, {
		get active() {
			return ctx.open;
		},
	});

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		e.stopPropagation();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			ref={mergedRef}
			role='dialog'
			aria-modal='true'
			tabIndex={-1}
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</div>
	);
}

function Header(props: DrawerHeaderProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function Close(props: DrawerCloseProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useDrawerContext();
	const state = createInteractiveState();
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.onOpenChange(false);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

export const Drawer = {
	Root,
	Portal,
	Overlay,
	Content,
	Header,
	Close,
};
