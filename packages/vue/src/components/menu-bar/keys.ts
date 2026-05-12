import { inject, type InjectionKey } from 'vue'
import type { MenuBarContextValue, MenuBarMenuContextValue } from './MenuBar.types'

export const MenuBarKey: InjectionKey<MenuBarContextValue> = Symbol('MenuBarContext')
export const MenuBarMenuKey: InjectionKey<MenuBarMenuContextValue> = Symbol('MenuBarMenuContext')

export function useMenuBarContext() {
	const ctx = inject(MenuBarKey)
	if (!ctx) throw new Error('MenuBar compound components must be used within MenuBar.Root')
	return ctx
}

export function useMenuBarMenuContext() {
	const ctx = inject(MenuBarMenuKey)
	if (!ctx) throw new Error('MenuBar.Trigger / Content must be used within MenuBar.Menu')
	return ctx
}
