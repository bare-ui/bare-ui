import type { JSX } from 'solid-js';

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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

export type CalendarNavProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CalendarPrevButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
export type CalendarNextButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
export type CalendarTitleProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface CalendarGridProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Render-prop for each day cell. Receives the date and its render-state. */
	renderDay?: (day: CalendarDay) => JSX.Element;
	/** Render-prop for the weekday header row. */
	renderWeekday?: (weekday: { name: string; short: string }) => JSX.Element;
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
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
		'data-today'?: string;
		'data-selected'?: string;
		'data-outside-month'?: string;
		'data-disabled'?: string;
		'data-weekend'?: string;
	};
}

export interface CalendarContextValue {
	readonly month: Date;
	readonly value: Date | null;
	readonly weekStartsOn: WeekStart;
	readonly locale: string;
	readonly minDate?: Date;
	readonly maxDate?: Date;
	isDateDisabled?: (date: Date) => boolean;
	goToMonth: (offset: number) => void;
	selectDate: (date: Date) => void;
	readonly canGoPrev: boolean;
	readonly canGoNext: boolean;
}
