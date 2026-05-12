import { inject, type InjectionKey } from 'vue'
import type { FormFieldContextValue } from './Form.types'

export const FormFieldKey: InjectionKey<FormFieldContextValue> = Symbol('FormFieldContext')

export function useFormFieldContext() {
	const ctx = inject(FormFieldKey)
	if (!ctx) throw new Error('Form field components must be used within Form.Field')
	return ctx
}
