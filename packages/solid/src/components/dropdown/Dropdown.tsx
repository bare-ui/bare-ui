import { createContext, createEffect, createSignal, onCleanup, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { DropdownContextValue, DropdownMenuProps, DropdownRootProps, DropdownTriggerProps } from './Dropdown.types';

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error('Dropdown compound components must be used within Dropdown.Root');
	}
	return context;
}

function Root(props: DropdownRootProps) {
	const [local, rest] = splitProps(props, ['open', 'defaultOpen', 'onOpenChange', 'children', 'class']);

	const [uncontrolledOpen, setUncontrolledOpen] = createSignal(local.defaultOpen ?? false);
	const isControlled = () => local.open !== undefined;
	const open = () => (isControlled() ? !!local.open : uncontrolledOpen());

	const handleOpenChange = (value: boolean) => {
		if (!isControlled()) setUncontrolledOpen(value);
		local.onOpenChange?.(value);
	};

	let rootEl: HTMLDivElement | undefined;
	createClickOutside(
		() => rootEl,
		() => {
			if (open()) handleOpenChange(false);
		},
	);

	createEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && open()) {
				handleOpenChange(false);
			}
		};
		window.addEventListener('keyup', handleEscape);
		onCleanup(() => window.removeEventListener('keyup', handleEscape));
	});

	const ctxValue: DropdownContextValue = {
		get open() {
			return open();
		},
		onOpenChange: handleOpenChange,
	};

	return (
		<DropdownContext.Provider value={ctxValue}>
			<div
				ref={rootEl}
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</DropdownContext.Provider>
	);
}

function Trigger(props: DropdownTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useDropdownContext();
	const state = createInteractiveState();
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.onOpenChange(!ctx.open);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			class={local.class}
			aria-expanded={ctx.open}
			data-state={ctx.open ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

function Menu(props: DropdownMenuProps) {
	const [local, rest] = splitProps(props, ['position', 'children', 'class']);
	const ctx = useDropdownContext();

	return (
		<Show when={ctx.open}>
			<div
				role='menu'
				class={local.class}
				data-state={ctx.open ? 'open' : 'closed'}
				data-position={local.position}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

export const Dropdown = {
	Root,
	Trigger,
	Menu,
};
