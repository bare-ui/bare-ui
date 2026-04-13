import { inject, type InjectionKey } from 'vue'
import type { InputContextValue } from './Input.types'

export const InputKey: InjectionKey<InputContextValue> = Symbol('InputContext')

export function useInputContext() {
  const ctx = inject(InputKey)
  if (!ctx) throw new Error('Input compound components must be used within Input.Root')
  return ctx
}
