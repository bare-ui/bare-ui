'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getDirection } from '@/hooks/use-direction';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { useWireUILocale, useWireUIMessages } from '@/context/wire-ui-context';
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
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
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
	if (!ctx) throw new globalThis.Error('Calendar compound components must be used within Calendar.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, CalendarRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = null,
			onChange,
			month: controlledMonth,
			defaultMonth,
			onMonthChange,
			minDate,
			maxDate,
			isDateDisabled,
			weekStartsOn = 0,
			locale: localeProp,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const locale = useWireUILocale(localeProp);
		const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue);
		const isValueControlled = controlledValue !== undefined;
		const value = isValueControlled ? (controlledValue as Date | null) : uncontrolledValue;

		const initialMonth = startOfMonth(defaultMonth ?? value ?? new Date());
		const [uncontrolledMonth, setUncontrolledMonth] = useState<Date>(initialMonth);
		const isMonthControlled = controlledMonth !== undefined;
		const month = isMonthControlled ? startOfMonth(controlledMonth as Date) : uncontrolledMonth;

		const setMonth = useCallback(
			(next: Date) => {
				const normalized = startOfMonth(next);
				if (!isMonthControlled) setUncontrolledMonth(normalized);
				onMonthChange?.(normalized);
			},
			[isMonthControlled, onMonthChange],
		);

		const goToMonth = useCallback((offset: number) => setMonth(addMonths(month, offset)), [month, setMonth]);

		const selectDate = useCallback(
			(date: Date) => {
				const normalized = startOfDay(date);
				if (!isValueControlled) setUncontrolledValue(normalized);
				onChange?.(normalized);
				if (!isSameMonth(normalized, month)) setMonth(normalized);
			},
			[isValueControlled, onChange, month, setMonth],
		);

		const canGoPrev = !minDate || addMonths(month, -1) >= startOfMonth(minDate);
		const canGoNext = !maxDate || addMonths(month, 1) <= startOfMonth(maxDate);

		const ctx = useMemo<CalendarContextValue>(
			() => ({
				month,
				value,
				weekStartsOn,
				locale,
				minDate,
				maxDate,
				isDateDisabled,
				goToMonth,
				selectDate,
				canGoPrev,
				canGoNext,
			}),
			[month, value, weekStartsOn, locale, minDate, maxDate, isDateDisabled, goToMonth, selectDate, canGoPrev, canGoNext],
		);

		return (
			<CalendarContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</CalendarContext.Provider>
		);
	},
);
Root.displayName = 'Calendar.Root';

// ---------------------------------------------------------------------------
// Nav + buttons + title
// ---------------------------------------------------------------------------

const Nav = React.forwardRef<HTMLDivElement, CalendarNavProps>(({ children, className, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));
Nav.displayName = 'Calendar.Nav';

const PrevButton = React.forwardRef<HTMLButtonElement, CalendarPrevButtonProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const ctx = useCalendarContext();
		const messages = useWireUIMessages();
		const disabled = !ctx.canGoPrev;
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-label={messages.calendar.previousMonth}
				className={className}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.goToMonth(-1);
					onClick?.(e);
				}}>
				{children ?? '‹'}
			</button>
		);
	},
);
PrevButton.displayName = 'Calendar.PrevButton';

const NextButton = React.forwardRef<HTMLButtonElement, CalendarNextButtonProps>(
	({ children, className, onClick, ...rest }, ref) => {
		const ctx = useCalendarContext();
		const messages = useWireUIMessages();
		const disabled = !ctx.canGoNext;
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-label={messages.calendar.nextMonth}
				className={className}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.goToMonth(1);
					onClick?.(e);
				}}>
				{children ?? '›'}
			</button>
		);
	},
);
NextButton.displayName = 'Calendar.NextButton';

const Title = React.forwardRef<HTMLDivElement, CalendarTitleProps>(({ className, children, ...rest }, ref) => {
	const ctx = useCalendarContext();
	const label = useMemo(
		() => new Intl.DateTimeFormat(ctx.locale, { month: 'long', year: 'numeric' }).format(ctx.month),
		[ctx.locale, ctx.month],
	);
	return (
		<div
			ref={ref}
			aria-live='polite'
			className={className}
			{...rest}>
			{children ?? label}
		</div>
	);
});
Title.displayName = 'Calendar.Title';

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

const Grid = React.forwardRef<HTMLDivElement, CalendarGridProps>(
	({ renderDay, renderWeekday, className, onKeyDown, 'aria-label': ariaLabelProp, ...rest }, ref) => {
		const ctx = useCalendarContext();
		const gridRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(gridRef, ref);
		// "Today" depends on the wall clock and local timezone, which differ between
		// the server (often UTC) and the client. Computing it during render would put
		// the data-today / aria-current marker (and the roving tabIndex) on different
		// cells on the server vs. the client, causing a hydration mismatch. Resolve it
		// to null on the first render (matches the server) and fill it in after mount.
		const [today, setToday] = useState<Date | null>(null);
		useEffect(() => {
			// Intentional: resolving "today" must wait until the client mounts so the
			// first render stays deterministic and matches the server-rendered HTML.
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setToday(startOfDay(new Date()));
		}, []);
		const weekdays = useMemo(() => getWeekdayNames(ctx.weekStartsOn, ctx.locale), [ctx.weekStartsOn, ctx.locale]);
		const days = useMemo(() => buildMonthGrid(ctx.month, ctx.weekStartsOn), [ctx.month, ctx.weekStartsOn]);

		// The day a keyboard navigation last targeted. Stays null until the user
		// presses an arrow key, so the grid never steals focus on mount.
		const [focusedDate, setFocusedDate] = useState<Date | null>(null);

		const isDisabledDate = useCallback(
			(d: Date) => {
				const beforeMin = ctx.minDate ? d < startOfDay(ctx.minDate) : false;
				const afterMax = ctx.maxDate ? d > startOfDay(ctx.maxDate) : false;
				return beforeMin || afterMax || (ctx.isDateDisabled?.(d) ?? false);
			},
			[ctx.minDate, ctx.maxDate, ctx.isDateDisabled],
		);

		// Exactly one day cell is tabbable (roving tabindex). Prefer the keyboard
		// target, then the selected date, then today, then the first selectable day
		// of the month — always an enabled, in-month date so Tab can reach the grid.
		const tabbableDate = useMemo(() => {
			const inMonth = (d: Date | null | undefined) =>
				d && isSameMonth(d, ctx.month) ? startOfDay(d) : null;
			for (const candidate of [inMonth(focusedDate), inMonth(ctx.value), inMonth(today)]) {
				if (candidate && !isDisabledDate(candidate)) return candidate;
			}
			const first = startOfMonth(ctx.month);
			for (let i = 0; i < 31; i++) {
				const d = addDays(first, i);
				if (!isSameMonth(d, ctx.month)) break;
				if (!isDisabledDate(d)) return d;
			}
			return first;
		}, [focusedDate, ctx.value, ctx.month, today, isDisabledDate]);

		// Move the keyboard target, switching month when it crosses a boundary.
		// Disabled (non-focusable) days are no-ops so focus is never lost.
		const moveTo = useCallback(
			(target: Date) => {
				const t = startOfDay(target);
				if (isDisabledDate(t)) return;
				const monthDiff =
					(t.getFullYear() - ctx.month.getFullYear()) * 12 + (t.getMonth() - ctx.month.getMonth());
				if (monthDiff !== 0) ctx.goToMonth(monthDiff);
				setFocusedDate(t);
			},
			[ctx, isDisabledDate],
		);

		// After a navigation re-renders the grid (possibly a new month), move DOM
		// focus to the targeted cell.
		useEffect(() => {
			if (!focusedDate) return;
			const cell = gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISODate(focusedDate)}"]`);
			cell?.focus();
		}, [focusedDate, ctx.month]);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
			const targetIso = (e.target as HTMLElement).getAttribute?.('data-date');
			const base = targetIso ? parseISODate(targetIso) : tabbableDate;
			// RTL mirrors the day grid: ArrowLeft moves to the next day, ArrowRight to the previous.
			const dayStep = getDirection(e.currentTarget) === 'rtl' ? -1 : 1;
			let next: Date | null = null;
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
			onKeyDown?.(e);
		};

		const gridLabel = useMemo(
			() => new Intl.DateTimeFormat(ctx.locale, { month: 'long', year: 'numeric' }).format(ctx.month),
			[ctx.locale, ctx.month],
		);

		const rowStyle: React.CSSProperties = {
			display: 'grid',
			gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
		};

		// Split the flat 42-day list into 6 weeks of 7 days so each week can be
		// wrapped in a role="row" (required by the ARIA grid pattern).
		const weeks = useMemo(() => {
			const chunks: Date[][] = [];
			for (let i = 0; i < days.length; i += 7) chunks.push(days.slice(i, i + 7));
			return chunks;
		}, [days]);

		return (
			<div
				ref={mergedRef}
				role='grid'
				aria-label={ariaLabelProp ?? gridLabel}
				className={className}
				onKeyDown={handleKeyDown}
				{...rest}>
				<div
					role='row'
					style={rowStyle}>
					{weekdays.map((wd) => {
						const weekday: CalendarWeekday = {
							name: wd.name,
							short: wd.short,
							props: {
								role: 'columnheader',
								'aria-label': wd.name,
							},
						};

						if (renderWeekday) return <React.Fragment key={wd.name}>{renderWeekday(weekday)}</React.Fragment>;

						return (
							<div
								key={wd.name}
								{...weekday.props}
								style={{ textAlign: 'center', padding: '4px 0' }}>
								{wd.short}
							</div>
						);
					})}
				</div>
				{weeks.map((week, weekIndex) => (
					<div
						key={weekIndex}
						role='row'
						style={rowStyle}>
						{week.map((d, dayIndex) => {
							const isOutsideMonth = !isSameMonth(d, ctx.month);
							const isToday = today ? isSameDay(d, today) : false;
							const isSelected = ctx.value ? isSameDay(d, ctx.value) : false;
							const beforeMin = ctx.minDate ? d < startOfDay(ctx.minDate) : false;
							const afterMax = ctx.maxDate ? d > startOfDay(ctx.maxDate) : false;
							const customDisabled = ctx.isDateDisabled?.(d) ?? false;
							const isDisabled = beforeMin || afterMax || customDisabled;
							const isWeekend = d.getDay() === 0 || d.getDay() === 6;

							const day: CalendarDay = {
								date: d,
								dayOfMonth: d.getDate(),
								isToday,
								isSelected,
								isOutsideMonth,
								isDisabled,
								isWeekend,
								props: {
									role: 'gridcell',
									type: 'button',
									tabIndex: isSameDay(d, tabbableDate) ? 0 : -1,
									disabled: isDisabled,
									'data-date': toISODate(d),
									'aria-selected': isSelected,
									'aria-current': isToday ? 'date' : undefined,
									'data-today': isToday ? '' : undefined,
									'data-selected': isSelected ? '' : undefined,
									'data-outside-month': isOutsideMonth ? '' : undefined,
									'data-disabled': isDisabled ? '' : undefined,
									'data-weekend': isWeekend ? '' : undefined,
									onClick: () => {
										if (!isDisabled) ctx.selectDate(d);
									},
								},
							};

							if (renderDay) return <React.Fragment key={dayIndex}>{renderDay(day)}</React.Fragment>;

							return (
								<button
									key={dayIndex}
									{...day.props}
									style={{
										padding: '6px',
										background: 'transparent',
										border: 'none',
										color: isOutsideMonth ? '#a3a3a3' : 'inherit',
										cursor: isDisabled ? 'not-allowed' : 'pointer',
										opacity: isDisabled ? 0.4 : 1,
									}}>
									{day.dayOfMonth}
								</button>
							);
						})}
					</div>
				))}
			</div>
		);
	},
);
Grid.displayName = 'Calendar.Grid';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Calendar = { Root, Nav, PrevButton, NextButton, Title, Grid };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Calendar.*`).
export { Root, Nav, PrevButton, NextButton, Title, Grid };
