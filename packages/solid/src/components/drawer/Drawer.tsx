import { createContext, createEffect, createSignal, onCleanup, Show, splitProps, useContext, type JSX } from 'solid-js';
import { Portal as SolidPortal } from 'solid-js/web';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
	const [uncontrolledOpen, setUncontrolledOpen] = createSignal(props.defaultOpen ?? false);
	const isControlled = () => props.open !== undefined;
	const open = () => (isControlled() ? !!props.open : uncontrolledOpen());

	const handleOpenChange = (value: boolean) => {
		if (!isControlled()) setUncontrolledOpen(value);
		props.onOpenChange?.(value);
	};

	createEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && open()) {
				handleOpenChange(false);
			}
		};
		window.addEventListener('keydown', handleEscape);
		onCleanup(() => window.removeEventListener('keydown', handleEscape));
	});

	const ctxValue: DrawerContextValue = {
		get open() {
			return open();
		},
		onOpenChange: handleOpenChange,
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
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useDrawerContext();

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		e.stopPropagation();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			role='dialog'
			aria-modal='true'
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
