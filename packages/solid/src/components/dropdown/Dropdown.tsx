import { createContext, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	const [local, rest] = splitProps(props, ['open', 'defaultOpen', 'onOpenChange', 'children', 'class', 'ref']);

	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
		get onChange() {
			return local.onOpenChange;
		},
	});

	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	createClickOutside(
		() => rootEl,
		() => {
			if (open()) setOpen(false);
		},
	);

	createKeyboard(
		{
			Escape: () => {
				if (open()) setOpen(false);
			},
		},
		{ event: 'keyup' },
	);

	const ctxValue: DropdownContextValue = {
		get open() {
			return open();
		},
		onOpenChange: (value: boolean) => setOpen(value),
	};

	return (
		<DropdownContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
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

export { Root, Trigger, Menu };
