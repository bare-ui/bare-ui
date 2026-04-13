import { inject, type InjectionKey } from 'vue'
import type { DropdownContextValue } from './Dropdown.types'

export const DropdownKey: InjectionKey<DropdownContextValue> = Symbol('DropdownContext')

export function useDropdownContext() {
  const ctx = inject(DropdownKey)
  if (!ctx) throw new Error('Dropdown compound components must be used within Dropdown.Root')
  return ctx
}
