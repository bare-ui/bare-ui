'use client';

import { createContext, createSignal, createUniqueId, useContext, splitProps, Show, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	AccordionContextValue,
	AccordionContentProps,
	AccordionItemContextValue,
	AccordionItemProps,
	AccordionRootProps,
	AccordionTriggerProps,
} from './Accordion.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
	const ctx = useContext(AccordionContext);
	if (!ctx) throw new Error('Accordion sub-components must be used within Accordion.Root');
	return ctx;
}

function useAccordionItemContext() {
	const ctx = useContext(AccordionItemContext);
	if (!ctx) throw new Error('Accordion.Trigger/Content must be used within Accordion.Item');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: AccordionRootProps) {
	// Cast to widen the discriminated union for splitProps — `collapsible` only
	// exists on the single variant but is harmless to split on either.
	const [local, rest] = splitProps(props as AccordionRootProps & { collapsible?: boolean }, [
		'type',
		'value',
		'defaultValue',
		'onChange',
		'disabled',
		'collapsible',
		'class',
		'children',
	]);

	// Normalize defaultValue → string[] for unified internal storage.
	const initialValues = (): string[] => {
		const dv = local.defaultValue;
		if (local.type === 'single') {
			return dv ? [dv as string] : [];
		}
		return ((dv as string[] | undefined) ?? []).slice();
	};

	const [uncontrolled, setUncontrolled] = createSignal<string[]>(initialValues());

	const isControlled = () => local.value !== undefined;

	const openValues = (): string[] => {
		if (!isControlled()) return uncontrolled();
		const v = local.value;
		if (local.type === 'single') return v ? [v as string] : [];
		return (v as string[]) ?? [];
	};

	const isOpen = (v: string) => openValues().includes(v);

	const toggle = (v: string) => {
		const current = openValues();

		if (local.type === 'single') {
			const collapsible = !!local.collapsible;
			const isCurrent = current[0] === v;
			let next: string[];
			if (isCurrent) {
				next = collapsible ? [] : current.length ? [current[0]] : [];
			} else {
				next = [v];
			}
			if (!isControlled()) setUncontrolled(next);
			(local.onChange as ((value: string) => void) | undefined)?.(next[0] ?? '');
		} else {
			const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
			if (!isControlled()) setUncontrolled(next);
			(local.onChange as ((value: string[]) => void) | undefined)?.(next);
		}
	};

	const ctxValue: AccordionContextValue = {
		isOpen,
		toggle,
		get disabled() {
			return local.disabled ?? false;
		},
	};

	return (
		<AccordionContext.Provider value={ctxValue}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</AccordionContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: AccordionItemProps) {
	const [local, rest] = splitProps(props, ['value', 'disabled', 'class', 'children']);
	const ctx = useAccordionContext();

	const isItemDisabled = () => !!local.disabled || ctx.disabled;
	const isItemOpen = () => ctx.isOpen(local.value);

	const baseId = createUniqueId();
	const triggerId = `${baseId}-trigger`;
	const contentId = `${baseId}-content`;

	const itemCtxValue: AccordionItemContextValue = {
		get value() {
			return local.value;
		},
		get isOpen() {
			return isItemOpen();
		},
		get disabled() {
			return isItemDisabled();
		},
		triggerId,
		contentId,
	};

	return (
		<AccordionItemContext.Provider value={itemCtxValue}>
			<div
				class={local.class}
				data-state={isItemOpen() ? 'open' : 'closed'}
				data-disabled={isItemDisabled() ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</AccordionItemContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: AccordionTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const itemCtx = useAccordionItemContext();
	const rootCtx = useAccordionContext();

	const state = createInteractiveState({
		get disabled() {
			return itemCtx.disabled;
		},
	});

	// Compose consumer-provided handlers (in `rest`) with the interactive-state
	// handlers — both fire when an event triggers (consumer first, then ours).
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		rootCtx.toggle(itemCtx.value);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			id={itemCtx.triggerId}
			disabled={itemCtx.disabled}
			aria-expanded={itemCtx.isOpen}
			aria-controls={itemCtx.contentId}
			data-state={itemCtx.isOpen ? 'open' : 'closed'}
			data-disabled={itemCtx.disabled ? '' : undefined}
			class={local.class}
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

function Content(props: AccordionContentProps) {
	const [local, rest] = splitProps(props, ['forceMount', 'class', 'children']);
	const itemCtx = useAccordionItemContext();

	return (
		<Show when={itemCtx.isOpen || local.forceMount}>
			<div
				role='region'
				id={itemCtx.contentId}
				aria-labelledby={itemCtx.triggerId}
				hidden={local.forceMount && !itemCtx.isOpen ? true : undefined}
				class={local.class}
				data-state={itemCtx.isOpen ? 'open' : 'closed'}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Accordion = {
	Root,
	Item,
	Trigger,
	Content,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Accordion.*`).
export { Root, Item, Trigger, Content };