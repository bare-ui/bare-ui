import { createContext, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createFocusTrap } from '@/primitives/create-focus-trap';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	const ctx = useContext(PopoverContext);
	if (!ctx) {
		throw new Error('Popover compound components must be used within Popover.Root');
	}
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: PopoverRootProps) {
	const [local, rest] = splitProps(props, [
		'open',
		'defaultOpen',
		'onOpenChange',
		'closeOnOutsideClick',
		'closeOnEscape',
		'children',
		'class',
		'ref',
	]);

	const [open, setOpenState] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
		get onChange() {
			return local.onOpenChange;
		},
	});

	let internalEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (internalEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	const setOpen = (value: boolean) => setOpenState(value);

	createClickOutside(
		() => internalEl,
		() => {
			if (open() && (local.closeOnOutsideClick ?? true)) setOpen(false);
		},
	);

	createKeyboard(
		{
			Escape: () => {
				if (open()) setOpen(false);
			},
		},
		{
			event: 'keyup',
			get enabled() {
				return local.closeOnEscape ?? true;
			},
		},
	);

	const triggerId = createId('popover-trigger');
	const contentId = createId('popover-content');

	const ctx: PopoverContextValue = {
		get open() {
			return !!open();
		},
		setOpen,
		get triggerId() {
			return triggerId;
		},
		get contentId() {
			return contentId;
		},
	};

	return (
		<PopoverContext.Provider value={ctx}>
			<div
				ref={mergedRef}
				class={local.class}
				data-state={open() ? 'open' : 'closed'}
				{...rest}>
				{local.children}
			</div>
		</PopoverContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: PopoverTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = usePopoverContext();
	const state = createInteractiveState();

	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setOpen(!ctx.open);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			id={ctx.triggerId}
			type='button'
			class={local.class}
			aria-haspopup='dialog'
			aria-expanded={ctx.open}
			aria-controls={ctx.contentId}
			data-state={ctx.open ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: PopoverContentProps) {
	const [local, rest] = splitProps(props, ['side', 'align', 'forceMount', 'class', 'children']);
	const ctx = usePopoverContext();

	const side = () => local.side ?? 'bottom';
	const align = () => local.align ?? 'center';
	const forceMount = () => local.forceMount ?? false;

	let contentEl: HTMLDivElement | undefined;

	// Non-modal dialog: move focus into the popover on open and restore it to
	// the trigger on close, but let Tab leave naturally (trap: false).
	createFocusTrap(() => contentEl, {
		get active() {
			return ctx.open;
		},
		trap: false,
	});

	return (
		<Show when={ctx.open || forceMount()}>
			<div
				ref={contentEl}
				id={ctx.contentId}
				role='dialog'
				aria-labelledby={ctx.triggerId}
				tabIndex={-1}
				class={local.class}
				hidden={!ctx.open && forceMount() ? true : undefined}
				data-state={ctx.open ? 'open' : 'closed'}
				data-side={side()}
				data-align={align()}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Close
// ---------------------------------------------------------------------------

function Close(props: PopoverCloseProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = usePopoverContext();
	const state = createInteractiveState();

	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setOpen(false);
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

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Popover = { Root, Trigger, Content, Close };

export { Root, Trigger, Content, Close };
