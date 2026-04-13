import { inject, type InjectionKey } from 'vue'
import type { DrawerContextValue } from './Drawer.types'

export const DrawerKey: InjectionKey<DrawerContextValue> = Symbol('DrawerContext')

export function useDrawerContext() {
  const ctx = inject(DrawerKey)
  if (!ctx) throw new Error('Drawer compound components must be used within Drawer.Root')
  return ctx
}
