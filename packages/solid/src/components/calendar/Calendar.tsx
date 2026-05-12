import { createContext, createMemo, createSignal, For, splitProps, useContext, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	CalendarContextValue,
	CalendarDay,
	CalendarGridProps,
	CalendarNavProps,
	CalendarNextButtonProps,
	CalendarPrevButtonProps,
	CalendarRootProps,
	CalendarTitleProps,
	WeekStart,
} from './Calendar.types';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function startOfDay(d: Date) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

function startOfMonth(d: Date) {
	const x = new Date(d);
	x.setDate(1);
	x.setHours(0, 0, 0, 0);
	return x;
}

function addMonths(d: Date, n: number) {
	const x = new Date(d);
	x.setMonth(x.getMonth() + n);
	return x;
}

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameMonth(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function buildMonthGrid(month: Date, weekStartsOn: WeekStart): Date[] {
	const first = startOfMonth(month);
	const offset = (first.getDay() - weekStartsOn + 7) % 7;
	const start = new Date(first);
	start.setDate(start.getDate() - offset);
	// Always 42 cells (6 weeks) for stable layout.
	return Array.from({ length: 42 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return d;
	});
}

function getWeekdayNames(weekStartsOn: WeekStart, locale: string): { name: string; short: string }[] {
	const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
	const narrow = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	const days: { name: string; short: string }[] = [];
	const base = new Date(2021, 7, 1); // Sunday Aug 1, 2021
	for (let i = 0; i < 7; i++) {
		const d = new Date(base);
		d.setDate(base.getDate() + ((weekStartsOn + i) % 7));
		days.push({ name: long.format(d), short: narrow.format(d) });
	}
	return days;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CalendarContext = createContext<CalendarContextValue | null>(null);

function useCalendarContext() {
	const ctx = useContext(CalendarContext);
	if (!ctx) throw new Error('Calendar compound components must be used within Calendar.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: CalendarRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'month',
		'defaultMonth',
		'onMonthChange',
		'minDate',
		'maxDate',
		'isDateDisabled',
		'weekStartsOn',
		'locale',
		'children',
		'class',
	]);

	const [uncontrolledValue, setUncontrolledValue] = createSignal<Date | null>(local.defaultValue ?? null);
	const isValueControlled = () => local.value !== undefined;
	const value = () => (isValueControlled() ? (local.value as Date | null) : uncontrolledValue());

	const initialMonth = startOfMonth(local.defaultMonth ?? local.defaultValue ?? new Date());
	const [uncontrolledMonth, setUncontrolledMonth] = createSignal<Date>(initialMonth);
	const isMonthControlled = () => local.month !== undefined;
	const month = () => (isMonthControlled() ? startOfMonth(local.month as Date) : uncontrolledMonth());

	const weekStartsOn = () => local.weekStartsOn ?? 0;
	const locale = () => local.locale ?? 'en-US';

	const setMonth = (next: Date) => {
		const normalized = startOfMonth(next);
		if (!isMonthControlled()) setUncontrolledMonth(normalized);
		local.onMonthChange?.(normalized);
	};

	const goToMonth = (offset: number) => setMonth(addMonths(month(), offset));

	const selectDate = (date: Date) => {
		const normalized = startOfDay(date);
		if (!isValueControlled()) setUncontrolledValue(normalized);
		local.onChange?.(normalized);
		if (!isSameMonth(normalized, month())) setMonth(normalized);
	};

	const canGoPrev = () => !local.minDate || addMonths(month(), -1) >= startOfMonth(local.minDate);
	const canGoNext = () => !local.maxDate || addMonths(month(), 1) <= startOfMonth(local.maxDate);

	const ctxValue: CalendarContextValue = {
		get month() {
			return month();
		},
		get value() {
			return value();
		},
		get weekStartsOn() {
			return weekStartsOn();
		},
		get locale() {
			return locale();
		},
		get minDate() {
			return local.minDate;
		},
		get maxDate() {
			return local.maxDate;
		},
		get isDateDisabled() {
			return local.isDateDisabled;
		},
		goToMonth,
		selectDate,
		get canGoPrev() {
			return canGoPrev();
		},
		get canGoNext() {
			return canGoNext();
		},
	};

	return (
		<CalendarContext.Provider value={ctxValue}>
			<div
				role='application'
				aria-label='Calendar'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</CalendarContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Nav + buttons + title
// ---------------------------------------------------------------------------

function Nav(props: CalendarNavProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function PrevButton(props: CalendarPrevButtonProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useCalendarContext();
	const disabled = () => !ctx.canGoPrev;
	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.goToMonth(-1);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			disabled={disabled()}
			aria-label='Previous month'
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children ?? '‹'}
		</button>
	);
}

function NextButton(props: CalendarNextButtonProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useCalendarContext();
	const disabled = () => !ctx.canGoNext;
	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.goToMonth(1);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			disabled={disabled()}
			aria-label='Next month'
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children ?? '›'}
		</button>
	);
}

function Title(props: CalendarTitleProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useCalendarContext();
	const label = createMemo(() =>
		new Intl.DateTimeFormat(ctx.locale, { month: 'long', year: 'numeric' }).format(ctx.month),
	);
	return (
		<div
			aria-live='polite'
			class={local.class}
			{...rest}>
			{local.children ?? label()}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

function Grid(props: CalendarGridProps) {
	const [local, rest] = splitProps(props, ['renderDay', 'renderWeekday', 'class']);
	const ctx = useCalendarContext();
	const today = startOfDay(new Date());
	const weekdays = createMemo(() => getWeekdayNames(ctx.weekStartsOn, ctx.locale));
	const days = createMemo(() => buildMonthGrid(ctx.month, ctx.weekStartsOn));

	const gridStyle: JSX.CSSProperties = {
		display: 'grid',
		'grid-template-columns': 'repeat(7, minmax(0, 1fr))',
	};

	// `buildDay` is called once per cell (inside `<For>`) and the returned
	// object lives for the cell's lifetime. Render state (selected, disabled,
	// outside-month) depends on reactive ctx signals — so those fields are
	// getters that re-read on access. `props` is itself a getter returning a
	// getter-keyed sub-object so Solid's JSX spread (`{...day.props}`) tracks
	// each individual attribute reactively. If we returned plain values, the
	// cell would freeze at first render and clicks wouldn't visibly update.
	const buildDay = (d: Date): CalendarDay => {
		const isWeekend = d.getDay() === 0 || d.getDay() === 6;
		const isToday = isSameDay(d, today);
		const isOutsideMonth = () => !isSameMonth(d, ctx.month);
		const isSelected = () => (ctx.value ? isSameDay(d, ctx.value) : false);
		const isDisabled = () => {
			const beforeMin = ctx.minDate ? d < startOfDay(ctx.minDate) : false;
			const afterMax = ctx.maxDate ? d > startOfDay(ctx.maxDate) : false;
			const customDisabled = ctx.isDateDisabled?.(d) ?? false;
			return beforeMin || afterMax || customDisabled;
		};

		return {
			date: d,
			dayOfMonth: d.getDate(),
			isToday,
			isWeekend,
			get isSelected() {
				return isSelected();
			},
			get isOutsideMonth() {
				return isOutsideMonth();
			},
			get isDisabled() {
				return isDisabled();
			},
			get props() {
				return {
					role: 'gridcell',
					type: 'button' as const,
					get tabIndex() {
						return isSelected() ? 0 : -1;
					},
					get disabled() {
						return isDisabled();
					},
					get 'aria-selected'() {
						return isSelected();
					},
					'aria-current': isToday ? 'date' : undefined,
					'data-today': isToday ? '' : undefined,
					get 'data-selected'() {
						return isSelected() ? '' : undefined;
					},
					get 'data-outside-month'() {
						return isOutsideMonth() ? '' : undefined;
					},
					get 'data-disabled'() {
						return isDisabled() ? '' : undefined;
					},
					'data-weekend': isWeekend ? '' : undefined,
					onClick: () => {
						if (!isDisabled()) ctx.selectDate(d);
					},
				};
			},
		};
	};

	return (
		<div
			role='grid'
			class={local.class}
			style={gridStyle}
			{...rest}>
			<For each={weekdays()}>
				{(wd) =>
					local.renderWeekday ? (
						local.renderWeekday(wd)
					) : (
						<div
							role='columnheader'
							aria-label={wd.name}
							style={{ 'text-align': 'center', padding: '4px 0' }}>
							{wd.short}
						</div>
					)
				}
			</For>
			<For each={days()}>
				{(d) => {
					// `days()` returns a fresh array on every month/weekStart change, so
					// For replaces all 42 cells — same shape as React reconciliation.
					const day = buildDay(d);
					return local.renderDay ? (
						local.renderDay(day)
					) : (
						<button
							{...day.props}
							style={{
								padding: '6px',
								background: 'transparent',
								border: 'none',
								color: day.isOutsideMonth ? '#a3a3a3' : 'inherit',
								cursor: day.isDisabled ? 'not-allowed' : 'pointer',
								opacity: day.isDisabled ? 0.4 : 1,
							}}>
							{day.dayOfMonth}
						</button>
					);
				}}
			</For>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Calendar = { Root, Nav, PrevButton, NextButton, Title, Grid };
