import { computed } from 'vue'
import { useToastContext } from './keys'

/**
 * Imperative API for triggering and dismissing toasts. Must be called
 * from a component descended from `<Toast.Provider>`.
 *
 * @example
 * const { toast, dismiss } = useToast()
 * toast({ title: 'Saved', status: 'success' })
 */
export function useToast() {
	const ctx = useToastContext()
	return {
		toast: ctx.add,
		dismiss: ctx.dismiss,
		toasts: computed(() => ctx.toasts.value),
	}
}
