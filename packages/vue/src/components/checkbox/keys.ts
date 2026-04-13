import { inject, type InjectionKey } from 'vue'
import type { CheckboxContextValue, CheckboxItemContextValue } from './Checkbox.types'

export const CheckboxKey: InjectionKey<CheckboxContextValue> = Symbol('CheckboxContext')
export const CheckboxItemKey: InjectionKey<CheckboxItemContextValue> = Symbol('CheckboxItemContext')

export function useCheckboxContext() {
  const ctx = inject(CheckboxKey)
  if (!ctx) throw new Error('Checkbox compound components must be used within Checkbox.Root')
  return ctx
}

export function useCheckboxItemContext() {
  const ctx = inject(CheckboxItemKey)
  if (!ctx) throw new Error('Checkbox.Indicator/Label must be used within Checkbox.Item')
  return ctx
}
