import { inject, type InjectionKey } from 'vue'
import type { ToastContextValue } from './Toast.types'

export const ToastKey: InjectionKey<ToastContextValue> = Symbol('ToastContext')

export function useToastContext() {
	const ctx = inject(ToastKey)
	if (!ctx) throw new Error('Toast components must be used within Toast.Provider')
	return ctx
}

let toastIdCounter = 0
export function makeId() {
	toastIdCounter += 1
	return `toast-${Date.now().toString(36)}-${toastIdCounter}`
}
