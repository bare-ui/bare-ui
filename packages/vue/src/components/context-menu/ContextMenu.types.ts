import type { ComputedRef, Ref } from 'vue'

export interface ContextMenuRootProps {
	/** Controlled open state. */
	open?: boolean
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean
	/** Called when the open state changes (right-click to open, outside click or Escape to close). */
	onOpenChange?: (open: boolean) => void
	/** Disable the context menu so right-click falls back to the native menu. */
	disabled?: boolean
}

export type ContextMenuTriggerProps = Record<string, never>
export type ContextMenuContentProps = Record<string, never>

export interface ContextMenuItemProps {
	/** Disable this menu item. */
	disabled?: boolean
	/** Called when the item is selected (and closes the menu). */
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
