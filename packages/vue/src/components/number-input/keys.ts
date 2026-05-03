import { inject, type InjectionKey } from 'vue'
import type { NumberInputContextValue } from './NumberInput.types'

export const NumberInputKey: InjectionKey<NumberInputContextValue> = Symbol('NumberInputContext')

export function useNumberInputContext() {
	const ctx = inject(NumberInputKey)
	if (!ctx) throw new Error('NumberInput compound components must be used within NumberInput.Root')
	return ctx
}
