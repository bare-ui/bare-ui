import type { ComputedRef } from 'vue'

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CalendarRootProps {
	value?: Date | null
	defaultValue?: Date | null
	onChange?: (date: Date | null) => void
	defaultMonth?: Date
	month?: Date
	onMonthChange?: (month: Date) => void
	minDate?: Date
	maxDate?: Date
	isDateDisabled?: (date: Date) => boolean
	weekStartsOn?: WeekStart
	locale?: string
}

export type CalendarNavProps = Record<string, never>
export type CalendarPrevButtonProps = Record<string, never>
export type CalendarNextButtonProps = Record<string, never>
export type CalendarTitleProps = Record<string, never>
export type CalendarGridProps = Record<string, never>

export interface CalendarDayProps {
	role: string
	type: 'button'
	tabindex: 0 | -1
	disabled: boolean
	'data-date': string
	'aria-selected': boolean
	'aria-current'?: 'date'
	'data-today': '' | undefined
	'data-selected': '' | undefined
	'data-outside-month': '' | undefined
	'data-disabled': '' | undefined
	'data-weekend': '' | undefined
	onClick: () => void
}

export interface CalendarDay {
	date: Date
	dayOfMonth: number
	isToday: boolean
	isSelected: boolean
	isOutsideMonth: boolean
	isDisabled: boolean
	isWeekend: boolean
	props: CalendarDayProps
}

export interface CalendarWeekdayProps {
	role: 'columnheader'
	'aria-label': string
}

export interface CalendarWeekday {
	name: string
	short: string
	props: CalendarWeekdayProps
}

export interface CalendarContextValue {
	month: ComputedRef<Date>
	value: ComputedRef<Date | null>
	weekStartsOn: ComputedRef<WeekStart>
	locale: ComputedRef<string>
	minDate: ComputedRef<Date | undefined>
	maxDate: ComputedRef<Date | undefined>
	isDateDisabled: ComputedRef<((date: Date) => boolean) | undefined>
	goToMonth: (offset: number) => void
	selectDate: (date: Date) => void
	canGoPrev: ComputedRef<boolean>
	canGoNext: ComputedRef<boolean>
}
