import type { ComputedRef } from 'vue'

export interface MenuBarRootProps {
	value?: string | null
	defaultValue?: string | null
	onValueChange?: (value: string | null) => void
}

export interface MenuBarMenuProps {
	value: string
}

export interface MenuBarTriggerProps {
	disabled?: boolean
}

export type MenuBarContentProps = Record<string, never>

export interface MenuBarItemProps {
	disabled?: boolean
	onSelect?: () => void
}

export type MenuBarSeparatorProps = Record<string, never>

export interface MenuBarContextValue {
	openMenu: ComputedRef<string | null>
	setOpenMenu: (value: string | null) => void
}

export interface MenuBarMenuContextValue {
	value: string
	open: ComputedRef<boolean>
	close: () => void
	openIt: () => void
	toggle: () => void
}
