'use client';

import { createContext, createMemo, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createFocusTrap } from '@/primitives/create-focus-trap';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { useWireUI } from '@/context/wire-ui-context';
import { mergeProps } from '@/utils/merge-props';
import { Calendar } from '../calendar/Calendar';
import type { CalendarRootProps } from '../calendar/Calendar.types';
import type {
	DatePickerContentProps,
	DatePickerContextValue,
	DatePickerRootProps,
	DatePickerTriggerProps,
	DatePickerValueProps,
} from './DatePicker.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DatePickerContext = createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
	const ctx = useContext(DatePickerContext);
	if (!ctx) throw new Error('DatePicker compound components must be used within DatePicker.Root');
	return ctx;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: DatePickerRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'open',
		'defaultOpen',
		'onOpenChange',
		'disabled',
		'closeOnSelect',
		'locale',
		'formatOptions',
		'children',
		'class',
		'ref',
	]);

	const [value, setValueState] = createControllableState<Date | null>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? null,
		get onChange() {
			return local.onChange;
		},
	});

	const [open, setOpenState] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
		get onChange() {
			return local.onOpenChange;
		},
	});

	const setOpen = (next: boolean) => setOpenState(next);
	const setValue = (next: Date | null) => setValueState(next);

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

	const wire = useWireUI();
	const triggerId = createId('datepicker-trigger');
	const contentId = createId('datepicker-content');

	const ctxValue: DatePickerContextValue = {
		get value() {
			return value() ?? null;
		},
		get open() {
			return !!open();
		},
		get disabled() {
			return !!local.disabled;
		},
		get closeOnSelect() {
			return local.closeOnSelect ?? true;
		},
		get locale() {
			return local.locale ?? wire.locale;
		},
		get formatOptions() {
			return local.formatOptions ?? DEFAULT_FORMAT;
		},
		setOpen,
		setValue,
		get triggerId() {
			return triggerId;
		},
		get contentId() {
			return contentId;
		},
	};

	return (
		<DatePickerContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				class={local.class}
				data-state={open() ? 'open' : 'closed'}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</DatePickerContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: DatePickerTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useDatePickerContext();
	const state = createInteractiveState({
		get disabled() {
			return ctx.disabled;
		},
	});
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
			disabled={ctx.disabled}
			aria-haspopup='dialog'
			aria-expanded={ctx.open}
			aria-controls={ctx.contentId}
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

function Value(props: DatePickerValueProps) {
	const [local, rest] = splitProps(props, ['placeholder', 'children', 'class']);
	const ctx = useDatePickerContext();
	const formatted = createMemo(() => {
		if (!ctx.value) return '';
		return new Intl.DateTimeFormat(ctx.locale, ctx.formatOptions).format(ctx.value);
	});

	const content = () => {
		const childrenFn = local.children;
		if (typeof childrenFn === 'function') return childrenFn(ctx.value, formatted());
		return ctx.value ? formatted() : local.placeholder;
	};

	return (
		<span
			class={local.class}
			data-placeholder={!ctx.value ? '' : undefined}
			{...rest}>
			{content()}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: DatePickerContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useDatePickerContext();

	let contentEl: HTMLDivElement | undefined;

	// Trap focus inside the popover while open and restore it to the trigger on
	// close (Escape, outside click, or selection). Prefer landing focus on the
	// calendar's active day (the roving-tabindex cell) rather than the first nav
	// button, per the date-picker dialog pattern.
	createFocusTrap(() => contentEl, {
		get active() {
			return ctx.open;
		},
		// Fall back to the content container if the roving gridcell isn't present
		// yet, so focus always moves into the dialog (mirrors React landing focus
		// inside the popover).
		initialFocus: () =>
			contentEl?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]') ?? contentEl,
	});

	return (
		<Show when={ctx.open}>
			<div
				ref={contentEl}
				id={ctx.contentId}
				role='dialog'
				aria-labelledby={ctx.triggerId}
				tabIndex={-1}
				class={local.class}
				data-state='open'
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// CalendarBridge
// ---------------------------------------------------------------------------

interface DatePickerCalendarProps extends Omit<CalendarRootProps, 'value' | 'onChange'> {
	children?: JSX.Element;
}

function CalendarBridge(props: DatePickerCalendarProps) {
	const ctx = useDatePickerContext();
	return (
		<Calendar.Root
			locale={ctx.locale}
			{...props}
			value={ctx.value}
			onChange={(next) => {
				ctx.setValue(next);
				if (ctx.closeOnSelect && next) ctx.setOpen(false);
			}}>
			{props.children}
		</Calendar.Root>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const DatePicker = { Root, Trigger, Value, Content, Calendar: CalendarBridge };

export { Root, Trigger, Value, Content, CalendarBridge };