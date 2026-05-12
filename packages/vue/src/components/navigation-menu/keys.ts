import { inject, type InjectionKey } from 'vue'
import type {
	NavigationMenuItemContextValue,
	NavigationMenuRootContextValue,
} from './NavigationMenu.types'

export const NavigationMenuKey: InjectionKey<NavigationMenuRootContextValue> = Symbol(
	'NavigationMenuContext',
)
export const NavigationMenuItemKey: InjectionKey<NavigationMenuItemContextValue> = Symbol(
	'NavigationMenuItemContext',
)

export function useNavigationMenuContext() {
	const ctx = inject(NavigationMenuKey)
	if (!ctx)
		throw new Error('NavigationMenu compound components must be used within NavigationMenu.Root')
	return ctx
}

export function useNavigationMenuItemContext() {
	const ctx = inject(NavigationMenuItemKey)
	if (!ctx)
		throw new Error('NavigationMenu.Trigger / Content must be used within NavigationMenu.Item')
	return ctx
}
