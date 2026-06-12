import { inject, type InjectionKey } from 'vue'
import type { CalendarContextValue, WeekStart } from './Calendar.types'

export const CalendarKey: InjectionKey<CalendarContextValue> = Symbol('CalendarContext')

export function useCalendarContext() {
	const ctx = inject(CalendarKey)
	if (!ctx) throw new Error('Calendar compound components must be used within Calendar.Root')
	return ctx
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function startOfDay(d: Date) {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	return x
}

export function startOfMonth(d: Date) {
	const x = new Date(d)
	x.setDate(1)
	x.setHours(0, 0, 0, 0)
	return x
}

export function addDays(d: Date, n: number): Date {
	const x = new Date(d)
	x.setDate(x.getDate() + n)
	return x
}

export function addMonths(d: Date, n: number): Date {
	const x = new Date(d)
	x.setMonth(x.getMonth() + n)
	return x
}

export function startOfWeek(d: Date, weekStartsOn: WeekStart): Date {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	const diff = (d.getDay() - weekStartsOn + 7) % 7
	x.setDate(x.getDate() - diff)
	return x
}

export function toISODate(d: Date): string {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

export function parseISODate(s: string): Date {
	const [y, m, day] = s.split('-').map(Number)
	return new Date(y, m - 1, day)
}

export function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
	)
}

export function isSameMonth(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function buildMonthGrid(month: Date, weekStartsOn: WeekStart): Date[] {
	const first = startOfMonth(month)
	const offset = (first.getDay() - weekStartsOn + 7) % 7
	const start = new Date(first)
	start.setDate(start.getDate() - offset)
	return Array.from({ length: 42 }, (_, i) => {
		const d = new Date(start)
		d.setDate(start.getDate() + i)
		return d
	})
}

export function getWeekdayNames(
	weekStartsOn: WeekStart,
	locale: string,
): { name: string; short: string }[] {
	const long = new Intl.DateTimeFormat(locale, { weekday: 'long' })
	const narrow = new Intl.DateTimeFormat(locale, { weekday: 'short' })
	const days: { name: string; short: string }[] = []
	const base = new Date(2021, 7, 1)
	for (let i = 0; i < 7; i++) {
		const d = new Date(base)
		d.setDate(base.getDate() + ((weekStartsOn + i) % 7))
		days.push({ name: long.format(d), short: narrow.format(d) })
	}
	return days
}
