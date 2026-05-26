import { createContext, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type {
	TabsContentProps,
	TabsContextValue,
	TabsListProps,
	TabsRootProps,
	TabsTriggerProps,
} from './Tabs.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error('Tabs compound components must be used within Tabs.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: TabsRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'orientation',
		'activationMode',
		'class',
		'children',
	]);

	const [value, setValueState] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		get onChange() {
			return local.onChange;
		},
	});

	const orientation = () => local.orientation ?? 'horizontal';
	const activationMode = () => local.activationMode ?? 'automatic';

	const triggers = new Map<string, HTMLButtonElement>();
	const order: string[] = [];

	const setValue = (next: string) => setValueState(next);

	const registerTrigger = (triggerValue: string, el: HTMLButtonElement | null) => {
		if (el) {
			triggers.set(triggerValue, el);
			if (!order.includes(triggerValue)) order.push(triggerValue);
		} else {
			triggers.delete(triggerValue);
			const idx = order.indexOf(triggerValue);
			if (idx !== -1) order.splice(idx, 1);
		}
	};

	const getTriggerOrder = () => order.slice();

	const baseId = createId('tabs');

	const ctx: TabsContextValue = {
		get value() {
			return value() ?? '';
		},
		setValue,
		get orientation() {
			return orientation();
		},
		get activationMode() {
			return activationMode();
		},
		registerTrigger,
		getTriggerOrder,
		baseId,
	};

	return (
		<TabsContext.Provider value={ctx}>
			<div
				class={local.class}
				data-orientation={orientation()}
				{...rest}>
				{local.children}
			</div>
		</TabsContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function List(props: TabsListProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useTabsContext();

	return (
		<div
			role='tablist'
			aria-orientation={ctx.orientation}
			data-orientation={ctx.orientation}
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: TabsTriggerProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'disabled',
		'class',
		'children',
		'ref',
		'onClick',
		'onKeyDown',
		'onFocus',
	]);
	const ctx = useTabsContext();

	const disabled = () => local.disabled ?? false;

	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});

	const setRef = createMergedRefs<HTMLButtonElement>(
		(el) => ctx.registerTrigger(local.value, el),
		(el) => (local.ref as ((el: HTMLButtonElement) => void) | undefined)?.(el),
	);

	const isSelected = () => ctx.value === local.value;

	const focusByOffset = (offset: number) => {
		const ord = ctx.getTriggerOrder();
		if (ord.length === 0) return;
		const currentIndex = ord.indexOf(local.value);
		let nextIndex = (currentIndex + offset + ord.length) % ord.length;
		// Skip disabled triggers.
		let safety = ord.length;
		while (safety-- > 0) {
			const candidate = ord[nextIndex];
			const el = document.getElementById(`${ctx.baseId}-trigger-${candidate}`) as HTMLButtonElement | null;
			if (el && !el.disabled) {
				el.focus();
				if (ctx.activationMode === 'automatic') ctx.setValue(candidate);
				return;
			}
			nextIndex = (nextIndex + offset + ord.length) % ord.length;
		}
	};

	const focusEdge = (edge: 'start' | 'end') => {
		const ord = ctx.getTriggerOrder();
		const ordered = edge === 'start' ? ord : ord.slice().reverse();
		for (const candidate of ordered) {
			const el = document.getElementById(`${ctx.baseId}-trigger-${candidate}`) as HTMLButtonElement | null;
			if (el && !el.disabled) {
				el.focus();
				if (ctx.activationMode === 'automatic') ctx.setValue(candidate);
				return;
			}
		}
	};

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		if (!disabled()) ctx.setValue(local.value);
		if (typeof local.onClick === 'function') {
			(local.onClick as JSX.EventHandler<HTMLButtonElement, MouseEvent>)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
		// Interactive-state press tracking first, then consumer handler.
		state.handlers.onKeyDown(e);
		if (typeof local.onKeyDown === 'function') {
			(local.onKeyDown as JSX.EventHandler<HTMLButtonElement, KeyboardEvent>)(e);
		}
		if (e.defaultPrevented) return;

		const horizontal = ctx.orientation === 'horizontal';
		const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
		const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

		if (e.key === nextKey) {
			e.preventDefault();
			focusByOffset(1);
		} else if (e.key === prevKey) {
			e.preventDefault();
			focusByOffset(-1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			focusEdge('start');
		} else if (e.key === 'End') {
			e.preventDefault();
			focusEdge('end');
		} else if (ctx.activationMode === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			ctx.setValue(local.value);
		}
	};

	const handleFocus: JSX.FocusEventHandler<HTMLButtonElement, FocusEvent> = (e) => {
		// Interactive-state focus tracking first, then consumer handler.
		state.handlers.onFocus(e);
		if (typeof local.onFocus === 'function') {
			(local.onFocus as JSX.FocusEventHandler<HTMLButtonElement, FocusEvent>)(e);
		}
		if (ctx.activationMode === 'automatic' && !disabled()) ctx.setValue(local.value);
	};

	return (
		<button
			ref={setRef}
			id={`${ctx.baseId}-trigger-${local.value}`}
			type='button'
			role='tab'
			aria-selected={isSelected()}
			aria-controls={`${ctx.baseId}-content-${local.value}`}
			tabindex={isSelected() ? 0 : -1}
			disabled={disabled()}
			class={local.class}
			data-state={isSelected() ? 'active' : 'inactive'}
			data-disabled={disabled() ? '' : undefined}
			data-orientation={ctx.orientation}
			{...state.dataAttributes}
			onMouseEnter={state.handlers.onMouseEnter}
			onMouseLeave={state.handlers.onMouseLeave}
			onPointerDown={state.handlers.onPointerDown}
			onPointerUp={state.handlers.onPointerUp}
			onKeyUp={state.handlers.onKeyUp}
			onBlur={state.handlers.onBlur}
			{...rest}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onFocus={handleFocus}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: TabsContentProps) {
	const [local, rest] = splitProps(props, ['value', 'forceMount', 'class', 'children']);
	const ctx = useTabsContext();

	const isActive = () => ctx.value === local.value;

	return (
		<Show when={isActive() || local.forceMount}>
			<div
				id={`${ctx.baseId}-content-${local.value}`}
				role='tabpanel'
				aria-labelledby={`${ctx.baseId}-trigger-${local.value}`}
				tabindex={0}
				hidden={!isActive() && local.forceMount ? true : undefined}
				class={local.class}
				data-state={isActive() ? 'active' : 'inactive'}
				data-orientation={ctx.orientation}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Tabs = { Root, List, Trigger, Content };
