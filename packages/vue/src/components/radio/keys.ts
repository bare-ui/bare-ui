import { inject, type InjectionKey } from 'vue'
import type { RadioContextValue, RadioItemContextValue } from './Radio.types'

export const RadioKey: InjectionKey<RadioContextValue> = Symbol('RadioContext')
export const RadioItemKey: InjectionKey<RadioItemContextValue> = Symbol('RadioItemContext')

export function useRadioContext() {
  const ctx = inject(RadioKey)
  if (!ctx) throw new Error('Radio compound components must be used within Radio.Root')
  return ctx
}

export function useRadioItemContext() {
  const ctx = inject(RadioItemKey)
  if (!ctx) throw new Error('Radio.Indicator/Label must be used within Radio.Item')
  return ctx
}
