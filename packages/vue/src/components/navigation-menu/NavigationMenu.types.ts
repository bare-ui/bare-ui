import type { ComputedRef, Ref } from 'vue'

export interface NavigationMenuRootProps {
	value?: string | null
	defaultValue?: string | null
	onValueChange?: (value: string | null) => void
	delayDuration?: number
	skipDelayDuration?: number
	'aria-label'?: string
}

export type NavigationMenuListProps = Record<string, never>

export interface NavigationMenuItemProps {
	value?: string
}

export interface NavigationMenuTriggerProps {
	disabled?: boolean
}

export type NavigationMenuContentProps = Record<string, never>

export interface NavigationMenuLinkProps {
	active?: boolean
	href?: string
}

export interface NavigationMenuRootContextValue {
	value: ComputedRef<string | null>
	setValue: (value: string | null) => void
	delayDuration: ComputedRef<number>
	skipDelayDuration: ComputedRef<number>
	/** Cancel any pending close. Called when cursor enters a Trigger or Content. */
	cancelClose: () => void
	/** Schedule a close after `skipDelayDuration`. Called when cursor leaves a Trigger or Content. */
	scheduleClose: () => void
	/**
	 * Set true by a keyboard-driven open so Content moves focus to its first link;
	 * left false for pointer/hover opens (which must not steal focus).
	 */
	focusContentOnOpen: Ref<boolean>
}

export interface NavigationMenuItemContextValue {
	value: string
}
