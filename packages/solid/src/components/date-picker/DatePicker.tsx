import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	Show,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
	]);

	const [uncontrolledValue, setUncontrolledValue] = createSignal<Date | null>(local.defaultValue ?? null);
	const isValueControlled = () => local.value !== undefined;
	const value = () => (isValueControlled() ? (local.value as Date | null) : uncontrolledValue());

	const [uncontrolledOpen, setUncontrolledOpen] = createSignal<boolean>(local.defaultOpen ?? false);
	const isOpenControlled = () => local.open !== undefined;
	const open = () => (isOpenControlled() ? (local.open as boolean) : uncontrolledOpen());

	const setOpen = (next: boolean) => {
		if (!isOpenControlled()) setUncontrolledOpen(next);
		local.onOpenChange?.(next);
	};

	const setValue = (next: Date | null) => {
		if (!isValueControlled()) setUncontrolledValue(next);
		local.onChange?.(next);
	};

	let rootEl: HTMLDivElement | undefined;

	createClickOutside(
		() => rootEl,
		() => {
			if (open()) setOpen(false);
		},
	);

	createEffect(() => {
		const handle = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open()) setOpen(false);
		};
		window.addEventListener('keyup', handle);
		onCleanup(() => window.removeEventListener('keyup', handle));
	});

	const triggerId = createUniqueId();
	const contentId = createUniqueId();

	const ctxValue: DatePickerContextValue = {
		get value() {
			return value();
		},
		get open() {
			return open();
		},
		get disabled() {
			return !!local.disabled;
		},
		get closeOnSelect() {
			return local.closeOnSelect ?? true;
		},
		get locale() {
			return local.locale ?? 'en-US';
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
				ref={rootEl}
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

	return (
		<Show when={ctx.open}>
			<div
				id={ctx.contentId}
				role='dialog'
				aria-labelledby={ctx.triggerId}
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
