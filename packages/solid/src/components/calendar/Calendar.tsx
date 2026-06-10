'use client';

import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	For,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { getDirection } from '@/primitives/create-direction';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { useWireUI } from '@/context/wire-ui-context';
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
	CalendarWeekday,
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
	const targetDay = x.getDate();
	x.setDate(1);
	x.setMonth(x.getMonth() + n);
	// Clamp the day so e.g. Jan 31 + 1 month lands on the last day of February,
	// not an overflowed March date.
	const lastDay = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
	x.setDate(Math.min(targetDay, lastDay));
	return x;
}

function addDays(d: Date, n: number) {
	const x = new Date(d);
	x.setDate(x.getDate() + n);
	return x;
}

function startOfWeek(d: Date, weekStartsOn: WeekStart) {
	const x = startOfDay(d);
	const offset = (x.getDay() - weekStartsOn + 7) % 7;
	x.setDate(x.getDate() - offset);
	return x;
}

/** Local (not UTC) `YYYY-MM-DD` key used to address a day cell in the grid. */
function toISODate(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

function parseISODate(s: string) {
	const [y, m, d] = s.split('-').map(Number);
	return new Date(y, m - 1, d);
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

	const wire = useWireUI();
	const weekStartsOn = () => local.weekStartsOn ?? 0;
	const locale = () => local.locale ?? wire.locale;

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
	const wire = useWireUI();
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
			aria-label={wire.messages.calendar.previousMonth}
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
	const wire = useWireUI();
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
			aria-label={wire.messages.calendar.nextMonth}
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
	const [local, rest] = splitProps(props, ['renderDay', 'renderWeekday', 'class', 'aria-label', 'onKeyDown']);
	const ctx = useCalendarContext();
	let gridRef: HTMLDivElement | undefined;
	const today = startOfDay(new Date());
	const weekdays = createMemo(() => getWeekdayNames(ctx.weekStartsOn, ctx.locale));
	const days = createMemo(() => buildMonthGrid(ctx.month, ctx.weekStartsOn));

	// The day a keyboard navigation last targeted. Stays null until the user
	// presses an arrow key, so the grid never steals focus on mount.
	const [focusedDate, setFocusedDate] = createSignal<Date | null>(null);

	const isDisabledDate = (d: Date) => {
		const beforeMin = ctx.minDate ? d < startOfDay(ctx.minDate) : false;
		const afterMax = ctx.maxDate ? d > startOfDay(ctx.maxDate) : false;
		return beforeMin || afterMax || (ctx.isDateDisabled?.(d) ?? false);
	};

	// Exactly one day cell is tabbable (roving tabindex). Prefer the keyboard
	// target, then the selected date, then today, then the first selectable day
	// of the month — always an enabled, in-month date so Tab can reach the grid.
	const tabbableDate = createMemo(() => {
		const inMonth = (d: Date | null | undefined) => (d && isSameMonth(d, ctx.month) ? startOfDay(d) : null);
		for (const candidate of [inMonth(focusedDate()), inMonth(ctx.value), inMonth(today)]) {
			if (candidate && !isDisabledDate(candidate)) return candidate;
		}
		const first = startOfMonth(ctx.month);
		for (let i = 0; i < 31; i++) {
			const d = addDays(first, i);
			if (!isSameMonth(d, ctx.month)) break;
			if (!isDisabledDate(d)) return d;
		}
		return first;
	});

	// Move the keyboard target, switching month when it crosses a boundary.
	// Disabled (non-focusable) days are no-ops so focus is never lost.
	const moveTo = (target: Date) => {
		const t = startOfDay(target);
		if (isDisabledDate(t)) return;
		const monthDiff = (t.getFullYear() - ctx.month.getFullYear()) * 12 + (t.getMonth() - ctx.month.getMonth());
		if (monthDiff !== 0) ctx.goToMonth(monthDiff);
		setFocusedDate(t);
	};

	// After a navigation re-renders the grid (possibly a new month), move DOM
	// focus to the targeted cell.
	createEffect(() => {
		const target = focusedDate();
		// Track ctx.month so focus re-applies after a month re-render.
		void ctx.month;
		if (!target) return;
		const cell = gridRef?.querySelector<HTMLElement>(`[data-date="${toISODate(target)}"]`);
		cell?.focus();
	});

	const handleKeyDown = (e: KeyboardEvent & { currentTarget: HTMLDivElement; target: Element }) => {
		const targetIso = (e.target as HTMLElement).getAttribute?.('data-date');
		const base = targetIso ? parseISODate(targetIso) : tabbableDate();
		let next: Date | null = null;
		// RTL mirrors the day grid: ArrowLeft moves to the next day, ArrowRight to the previous.
		const dayStep = getDirection(e.currentTarget) === 'rtl' ? -1 : 1;
		switch (e.key) {
			case 'ArrowLeft':
				next = addDays(base, -dayStep);
				break;
			case 'ArrowRight':
				next = addDays(base, dayStep);
				break;
			case 'ArrowUp':
				next = addDays(base, -7);
				break;
			case 'ArrowDown':
				next = addDays(base, 7);
				break;
			case 'Home':
				next = startOfWeek(base, ctx.weekStartsOn);
				break;
			case 'End':
				next = addDays(startOfWeek(base, ctx.weekStartsOn), 6);
				break;
			case 'PageUp':
				next = addMonths(base, e.shiftKey ? -12 : -1);
				break;
			case 'PageDown':
				next = addMonths(base, e.shiftKey ? 12 : 1);
				break;
		}
		if (next) {
			e.preventDefault();
			moveTo(next);
		}
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
	};

	// The grid's accessible name is the visible month/year, so a screen reader
	// announces "January 2024, grid" when focus enters the day grid.
	const gridLabel = createMemo(() =>
		new Intl.DateTimeFormat(ctx.locale, { month: 'long', year: 'numeric' }).format(ctx.month),
	);

	// Each ARIA grid row lays out its seven cells; the outer grid stacks the rows.
	const rowStyle: JSX.CSSProperties = {
		display: 'grid',
		'grid-template-columns': 'repeat(7, minmax(0, 1fr))',
	};

	// Split the flat 42-day list into 6 weeks of 7 days so each week can be
	// wrapped in a role="row" (required by the ARIA grid pattern).
	const weeks = createMemo(() => {
		const flat = days();
		const chunks: Date[][] = [];
		for (let i = 0; i < flat.length; i += 7) chunks.push(flat.slice(i, i + 7));
		return chunks;
	});

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
					role: 'gridcell' as const,
					type: 'button' as const,
					get tabIndex() {
						return isSameDay(d, tabbableDate()) ? 0 : -1;
					},
					get disabled() {
						return isDisabled();
					},
					'data-date': toISODate(d),
					get 'aria-selected'() {
						return isSelected();
					},
					'aria-current': isToday ? ('date' as const) : undefined,
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
			ref={gridRef}
			role='grid'
			aria-label={local['aria-label'] ?? gridLabel()}
			class={local.class}
			onKeyDown={handleKeyDown}
			{...rest}>
			<div
				role='row'
				style={rowStyle}>
				<For each={weekdays()}>
					{(wd) => {
						const weekday: CalendarWeekday = {
							name: wd.name,
							short: wd.short,
							props: {
								role: 'columnheader',
								'aria-label': wd.name,
							},
						};
						return local.renderWeekday ? (
							local.renderWeekday(weekday)
						) : (
							<div
								{...weekday.props}
								style={{ 'text-align': 'center', padding: '4px 0' }}>
								{wd.short}
							</div>
						);
					}}
				</For>
			</div>
			<For each={weeks()}>
				{(week) => (
					<div
						role='row'
						style={rowStyle}>
						<For each={week}>
							{(d) => {
								// `weeks()` returns fresh arrays on every month/weekStart change,
								// so For replaces all cells — same shape as React reconciliation.
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
				)}
			</For>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Calendar = { Root, Nav, PrevButton, NextButton, Title, Grid };

// Named exports expose the sub-components to Storybook's docgen (public API stays `Calendar.*`).
export { Root, Nav, PrevButton, NextButton, Title, Grid };