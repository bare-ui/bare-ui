import { inject, type InjectionKey } from 'vue'
import type { DatePickerContextValue } from './DatePicker.types'

export const DatePickerKey: InjectionKey<DatePickerContextValue> = Symbol('DatePickerContext')

export function useDatePickerContext() {
	const ctx = inject(DatePickerKey)
	if (!ctx) throw new Error('DatePicker compound components must be used within DatePicker.Root')
	return ctx
}

export const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
}
