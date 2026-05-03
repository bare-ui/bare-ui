import { inject, type InjectionKey } from 'vue'
import type { ComboboxContextValue } from './Combobox.types'

export const ComboboxKey: InjectionKey<ComboboxContextValue> = Symbol('ComboboxContext')

export function useComboboxContext() {
	const ctx = inject(ComboboxKey)
	if (!ctx) throw new Error('Combobox compound components must be used within Combobox.Root')
	return ctx
}
