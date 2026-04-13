import { inject, type InjectionKey } from 'vue'
import type { SelectContextValue } from './Select.types'

export const SelectKey: InjectionKey<SelectContextValue> = Symbol('SelectContext')

export function useSelectContext() {
  const ctx = inject(SelectKey)
  if (!ctx) throw new Error('Select sub-components must be used within Select.Root')
  return ctx
}
