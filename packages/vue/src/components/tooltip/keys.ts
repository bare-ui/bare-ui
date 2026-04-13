import { inject, type InjectionKey } from 'vue'
import type { TooltipContextValue } from './Tooltip.types'

export const TooltipKey: InjectionKey<TooltipContextValue> = Symbol('TooltipContext')

export function useTooltipContext() {
  const ctx = inject(TooltipKey)
  if (!ctx) throw new Error('Tooltip compound components must be used within Tooltip.Root')
  return ctx
}
