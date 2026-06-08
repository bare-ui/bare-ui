'use client';

import { createContext, mergeProps, splitProps, useContext, Show, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import type {
	StepperContentProps,
	StepperContextValue,
	StepperItemContextValue,
	StepperItemProps,
	StepperListProps,
	StepperNextTriggerProps,
	StepperPrevTriggerProps,
	StepperRootProps,
	StepperSeparatorProps,
	StepperTriggerProps,
} from './Stepper.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const StepperContext = createContext<StepperContextValue | null>(null);
const StepperItemContext = createContext<StepperItemContextValue | null>(null);

function useStepperContext() {
	const ctx = useContext(StepperContext);
	if (!ctx) throw new Error('Stepper sub-components must be used within Stepper.Root');
	return ctx;
}

function useStepperItemContext() {
	const ctx = useContext(StepperItemContext);
	if (!ctx) throw new Error('Stepper.Trigger must be used within Stepper.Item');
	return ctx;
}

function stepState(index: number, current: number): 'active' | 'completed' | 'inactive' {
	if (index === current) return 'active';
	if (index < current) return 'completed';
	return 'inactive';
}

function callUserHandler<E>(handler: unknown, e: E) {
	if (typeof handler === 'function') (handler as (event: E) => void)(e);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: StepperRootProps) {
	const merged = mergeProps({ defaultValue: 0, orientation: 'horizontal' as const, linear: false }, props);
	const [local, rest] = splitProps(merged, [
		'count',
		'value',
		'defaultValue',
		'onChange',
		'orientation',
		'linear',
		'class',
		'children',
	]);

	const [current, setCurrent] = createControllableState<number>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue,
		get onChange() {
			return local.onChange;
		},
	});

	const goTo = (index: number) => {
		const clamped = Math.min(Math.max(index, 0), local.count - 1);
		if (local.linear && clamped > current()) return;
		setCurrent(clamped);
	};

	const next = () => setCurrent(Math.min(current() + 1, local.count - 1));
	const prev = () => setCurrent(Math.max(current() - 1, 0));

	const ctxValue: StepperContextValue = {
		get current() {
			return current();
		},
		get count() {
			return local.count;
		},
		get orientation() {
			return local.orientation;
		},
		get linear() {
			return local.linear;
		},
		goTo,
		next,
		prev,
		isActive: (i) => i === current(),
		isCompleted: (i) => i < current(),
	};

	return (
		<StepperContext.Provider value={ctxValue}>
			<div
				data-orientation={local.orientation}
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</StepperContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function List(props: StepperListProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useStepperContext();
	return (
		<div
			role='list'
			data-orientation={ctx.orientation}
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: StepperItemProps) {
	const [local, rest] = splitProps(props, ['index', 'class', 'children']);
	const ctx = useStepperContext();
	const state = () => stepState(local.index, ctx.current);

	const itemCtxValue: StepperItemContextValue = {
		get index() {
			return local.index;
		},
	};

	return (
		<StepperItemContext.Provider value={itemCtxValue}>
			<div
				role='listitem'
				data-state={state()}
				data-index={local.index}
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</StepperItemContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: StepperTriggerProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'disabled']);
	const ctx = useStepperContext();
	const itemCtx = useStepperItemContext();
	const state = () => stepState(itemCtx.index, ctx.current);
	const isDisabled = () => local.disabled ?? (ctx.linear && itemCtx.index > ctx.current);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.goTo(itemCtx.index);
		callUserHandler(local.onClick, e);
	};

	return (
		<button
			type='button'
			disabled={isDisabled()}
			aria-current={state() === 'active' ? 'step' : undefined}
			data-state={state()}
			class={local.class}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

function Separator(props: StepperSeparatorProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useStepperContext();
	const item = useContext(StepperItemContext);
	// When inside an Item, the separator is "complete" once that step is done.
	const completed = () => (item ? item.index < ctx.current : undefined);
	const dataState = () => {
		const c = completed();
		return c === undefined ? undefined : c ? 'completed' : 'inactive';
	};
	return (
		<div
			role='separator'
			aria-hidden='true'
			data-orientation={ctx.orientation}
			data-state={dataState()}
			class={local.class}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: StepperContentProps) {
	const merged = mergeProps({ forceMount: false }, props);
	const [local, rest] = splitProps(merged, ['index', 'forceMount', 'class', 'children']);
	const ctx = useStepperContext();
	const active = () => ctx.current === local.index;

	return (
		<Show when={local.forceMount || active()}>
			<div
				role='tabpanel'
				hidden={local.forceMount && !active() ? true : undefined}
				data-state={active() ? 'active' : 'inactive'}
				data-index={local.index}
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Prev / Next triggers
// ---------------------------------------------------------------------------

function PrevTrigger(props: StepperPrevTriggerProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'disabled']);
	const ctx = useStepperContext();

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.prev();
		callUserHandler(local.onClick, e);
	};

	return (
		<button
			type='button'
			disabled={local.disabled ?? ctx.current === 0}
			class={local.class}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</button>
	);
}

function NextTrigger(props: StepperNextTriggerProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick', 'disabled']);
	const ctx = useStepperContext();

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.next();
		callUserHandler(local.onClick, e);
	};

	return (
		<button
			type='button'
			disabled={local.disabled ?? ctx.current >= ctx.count - 1}
			class={local.class}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Stepper = {
	Root,
	List,
	Item,
	Trigger,
	Separator,
	Content,
	PrevTrigger,
	NextTrigger,
};

export { Root, List, Item, Trigger, Separator, Content, PrevTrigger, NextTrigger };