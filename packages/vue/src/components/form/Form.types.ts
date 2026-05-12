import type { ComputedRef, Ref } from 'vue'

export type FormRootProps = Record<string, never>

export interface FormFieldProps {
	/** Optional name (used as id prefix and on the `name` attr if Control wraps a native field). */
	name?: string
	/** Marks the whole field as invalid; toggles aria-invalid + data-invalid on the control. */
	invalid?: boolean
	/** Marks the field as required (toggles aria-required + data-required). */
	required?: boolean
	/** Marks the field as disabled (toggles disabled + data-disabled on the control). */
	disabled?: boolean
}

export interface FormLabelProps {
	/** When true, render a different element instead of <label>. */
	asChild?: boolean
}

export type FormControlProps = Record<string, never>
export type FormDescriptionProps = Record<string, never>

export interface FormErrorProps {
	/** When true, render even if the surrounding Field is not invalid. */
	forceMount?: boolean
}

export interface FormFieldContextValue {
	id: string
	descriptionId: string
	errorId: string
	name: ComputedRef<string | undefined>
	invalid: ComputedRef<boolean>
	required: ComputedRef<boolean>
	disabled: ComputedRef<boolean>
	hasDescription: Ref<boolean>
	hasError: Ref<boolean>
	registerDescription: (present: boolean) => void
	registerError: (present: boolean) => void
}
