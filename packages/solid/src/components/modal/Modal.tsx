import { createContext, createEffect, createSignal, onCleanup, Show, splitProps, useContext, type JSX } from 'solid-js';
import { Portal as SolidPortal } from 'solid-js/web';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
		throw new Error('Modal compound components must be used within Modal.Root');
	}
	return context;
}

function Root(props: ModalRootProps) {
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

	const ctxValue: ModalContextValue = {
		get open() {
			return open();
		},
		onOpenChange: handleOpenChange,
	};

	return <ModalContext.Provider value={ctxValue}>{props.children}</ModalContext.Provider>;
}

function Portal(props: ModalPortalProps) {
	const ctx = useModalContext();

	return (
		<Show when={ctx.open}>
			<SolidPortal mount={props.container}>{props.children}</SolidPortal>
		</Show>
	);
}

function Overlay(props: ModalOverlayProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useModalContext();

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

function Content(props: ModalContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useModalContext();

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

function Close(props: ModalCloseProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useModalContext();
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

export const Modal = {
	Root,
	Portal,
	Overlay,
	Content,
	Close,
};
