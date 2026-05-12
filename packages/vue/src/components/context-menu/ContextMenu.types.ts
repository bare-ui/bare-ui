import type { ComputedRef, Ref } from 'vue'

export interface ContextMenuRootProps {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	disabled?: boolean
}

export type ContextMenuTriggerProps = Record<string, never>
export type ContextMenuContentProps = Record<string, never>

export interface ContextMenuItemProps {
	disabled?: boolean
	onSelect?: () => void
}

export type ContextMenuSeparatorProps = Record<string, never>

export interface ContextMenuContextValue {
	open: ComputedRef<boolean>
	disabled: ComputedRef<boolean>
	position: Ref<{ x: number; y: number }>
	openAt: (x: number, y: number) => void
	close: () => void
}
