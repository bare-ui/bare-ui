import type { ComputedRef } from 'vue'

export interface DatePickerRootProps {
	value?: Date | null
	defaultValue?: Date | null
	onChange?: (date: Date | null) => void
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	disabled?: boolean
	closeOnSelect?: boolean
	locale?: string
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
