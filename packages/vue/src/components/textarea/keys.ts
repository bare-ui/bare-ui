import { inject, type InjectionKey } from 'vue'
import type { TextareaContextValue } from './Textarea.types'

export const TextareaKey: InjectionKey<TextareaContextValue> = Symbol('TextareaContext')

export function useTextareaContext() {
  const ctx = inject(TextareaKey)
  if (!ctx) throw new Error('Textarea compound components must be used within Textarea.Root')
  return ctx
}
