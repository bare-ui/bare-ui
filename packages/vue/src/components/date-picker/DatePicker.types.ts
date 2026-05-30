import type { ComputedRef } from 'vue'

export interface DatePickerRootProps {
	/** Controlled selected date (`null` when cleared). */
	value?: Date | null
	/** Initially selected date (uncontrolled). */
	defaultValue?: Date | null
	/** Called with the newly selected date, or `null` when cleared. */
	onChange?: (date: Date | null) => void
	/** Controlled open state of the calendar popover. */
	open?: boolean
	/** Initial open state of the calendar popover (uncontrolled). */
	defaultOpen?: boolean
	/** Called when the calendar popover opens or closes. */
	onOpenChange?: (open: boolean) => void
	/** Disable the trigger and prevent opening the calendar. */
	disabled?: boolean
	/** Close the popover automatically once a date is selected. */
	closeOnSelect?: boolean
	/** Locale for the formatted display value. */
	locale?: string
	/** Format options for the displayed date. */
	formatOptions?: Intl.DateTimeFormatOptions
}

export type DatePickerTriggerProps = Record<string, never>

export interface DatePickerValueProps {
	placeholder?: string
}

export type DatePickerContentProps = Record<string, never>

export interface DatePickerContextValue {
	value: ComputedRef<Date | null>
	open: ComputedRef<boolean>
	disabled: ComputedRef<boolean>
	closeOnSelect: ComputedRef<boolean>
	locale: ComputedRef<string>
	formatOptions: ComputedRef<Intl.DateTimeFormatOptions>
	setOpen: (open: boolean) => void
	setValue: (date: Date | null) => void
	triggerId: string
	contentId: string
}
