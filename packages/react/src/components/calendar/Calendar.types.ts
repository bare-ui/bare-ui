import React from 'react';

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled selected date. Use null for empty. */
	value?: Date | null;
	/** Initial selected date (uncontrolled). */
	defaultValue?: Date | null;
	/** Called when the selection changes. */
	onChange?: (date: Date | null) => void;
	/** Initial month displayed (uncontrolled). Defaults to today. */
	defaultMonth?: Date;
	/** Controlled month displayed. */
	month?: Date;
	/** Called when the visible month changes. */
	onMonthChange?: (month: Date) => void;
	/** Earliest selectable date. */
	minDate?: Date;
	/** Latest selectable date. */
	maxDate?: Date;
	/** Custom predicate to disable specific dates. */
	isDateDisabled?: (date: Date) => boolean;
	/** First day of the week. 0 = Sunday, 1 = Monday, ... Default 0. */
	weekStartsOn?: WeekStart;
	/** Locale for month/weekday names. Default 'en-US'. */
	locale?: string;
}

export type CalendarNavProps = React.HTMLAttributes<HTMLDivElement>;
export type CalendarPrevButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type CalendarNextButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type CalendarTitleProps = React.HTMLAttributes<HTMLDivElement>;

export interface CalendarGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Render-prop for each day cell. Receives the date and its render-state. */
	renderDay?: (day: CalendarDay) => React.ReactNode;
	/** Render-prop for the weekday header row. */
	renderWeekday?: (weekday: { name: string; short: string }) => React.ReactNode;
}

export interface CalendarDay {
	date: Date;
	dayOfMonth: number;
	isToday: boolean;
	isSelected: boolean;
	isOutsideMonth: boolean;
	isDisabled: boolean;
	isWeekend: boolean;
	/** Spread these onto your button element. Includes ARIA + data-* attributes. */
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: `data-${string}`]: string | undefined };
}

export interface CalendarContextValue {
	month: Date;
	value: Date | null;
	weekStartsOn: WeekStart;
	locale: string;
	minDate?: Date;
	maxDate?: Date;
	isDateDisabled?: (date: Date) => boolean;
	goToMonth: (offset: number) => void;
	selectDate: (date: Date) => void;
	canGoPrev: boolean;
	canGoNext: boolean;
}
