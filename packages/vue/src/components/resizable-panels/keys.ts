import { inject, type InjectionKey } from 'vue'
import type { InternalGroupContext } from './ResizablePanels.types'

export const PanelGroupKey: InjectionKey<InternalGroupContext> = Symbol('PanelGroupContext')

export function usePanelGroupContext() {
	const ctx = inject(PanelGroupKey)
	if (!ctx) throw new Error('Panel components must be used within ResizablePanels.Group')
	return ctx
}
