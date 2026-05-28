import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useInteractiveState } from '@/hooks/use-interactive-state';
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
			locale = 'en-US',
			children,
			className,
			...rest
		},
		ref,
	) => {
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
					role='application'
					aria-label='Calendar'
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
		const disabled = !ctx.canGoPrev;
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-label='Previous month'
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
		const disabled = !ctx.canGoNext;
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-label='Next month'
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
	({ renderDay, renderWeekday, className, ...rest }, ref) => {
		const ctx = useCalendarContext();
		const today = useMemo(() => startOfDay(new Date()), []);
		const weekdays = useMemo(() => getWeekdayNames(ctx.weekStartsOn, ctx.locale), [ctx.weekStartsOn, ctx.locale]);
		const days = useMemo(() => buildMonthGrid(ctx.month, ctx.weekStartsOn), [ctx.month, ctx.weekStartsOn]);

		const gridStyle: React.CSSProperties = {
			display: 'grid',
			gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
		};

		return (
			<div
				ref={ref}
				role='grid'
				className={className}
				style={gridStyle}
				{...rest}>
				{weekdays.map((wd) =>
					renderWeekday ? (
						<React.Fragment key={wd.name}>{renderWeekday(wd)}</React.Fragment>
					) : (
						<div
							key={wd.name}
							role='columnheader'
							aria-label={wd.name}
							style={{ textAlign: 'center', padding: '4px 0' }}>
							{wd.short}
						</div>
					),
				)}
				{days.map((d, i) => {
					const isOutsideMonth = !isSameMonth(d, ctx.month);
					const isToday = isSameDay(d, today);
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
							tabIndex: isSelected ? 0 : -1,
							disabled: isDisabled,
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

					if (renderDay) return <React.Fragment key={i}>{renderDay(day)}</React.Fragment>;

					return (
						<button
							key={i}
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
