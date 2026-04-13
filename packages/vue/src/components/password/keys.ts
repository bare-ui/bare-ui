import { inject, type InjectionKey } from 'vue'
import type { PasswordContextValue } from './Password.types'

export const PasswordKey: InjectionKey<PasswordContextValue> = Symbol('PasswordContext')

export function usePasswordContext() {
  const ctx = inject(PasswordKey)
  if (!ctx) throw new Error('Password sub-components must be used within Password.Root')
  return ctx
}
