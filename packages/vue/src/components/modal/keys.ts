import { inject, type InjectionKey } from 'vue'
import type { ModalContextValue } from './Modal.types'

export const ModalKey: InjectionKey<ModalContextValue> = Symbol('ModalContext')

export function useModalContext() {
  const ctx = inject(ModalKey)
  if (!ctx) throw new Error('Modal compound components must be used within Modal.Root')
  return ctx
}
