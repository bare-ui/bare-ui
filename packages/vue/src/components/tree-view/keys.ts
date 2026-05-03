import { inject, type InjectionKey } from 'vue'
import type { TreeViewContextValue } from './TreeView.types'

export const TreeViewKey: InjectionKey<TreeViewContextValue> = Symbol('TreeViewContext')

export function useTreeViewContext() {
	const ctx = inject(TreeViewKey)
	if (!ctx) throw new Error('TreeView compound components must be used within TreeView.Root')
	return ctx
}
