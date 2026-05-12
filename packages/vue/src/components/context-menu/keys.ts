import { inject, type InjectionKey } from 'vue'
import type { ContextMenuContextValue } from './ContextMenu.types'

export const ContextMenuKey: InjectionKey<ContextMenuContextValue> = Symbol('ContextMenuContext')

export function useContextMenuContext() {
	const ctx = inject(ContextMenuKey)
	if (!ctx) throw new Error('ContextMenu compound components must be used within ContextMenu.Root')
	return ctx
}
