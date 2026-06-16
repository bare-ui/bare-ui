<script setup lang="ts">
import { useMenuBarContext, useMenuBarMenuContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { getDirection } from '@/composables/use-direction'

defineOptions({ name: 'MenuBarTrigger', inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const bar = useMenuBarContext()
const menu = useMenuBarMenuContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })

function onClick() {
	menu.toggle()
}

function onPointerEnter() {
	if (bar.openMenu.value && bar.openMenu.value !== menu.value) bar.setOpenMenu(menu.value)
}

// Move focus between top-level triggers; if a menu is already open, opening
// follows focus (APG Menubar).
function focusSibling(current: HTMLElement, delta: number) {
	const menubarEl = current.closest('[role="menubar"]')
	if (!menubarEl) return
	const triggers = Array.from(
		menubarEl.querySelectorAll<HTMLElement>('[role="menuitem"][aria-haspopup="menu"]'),
	).filter((t) => !t.hasAttribute('disabled'))
	const idx = triggers.indexOf(current)
	if (idx < 0) return
	const wasOpen = current.getAttribute('aria-expanded') === 'true'
	const next = triggers[(idx + delta + triggers.length) % triggers.length]
	next.focus()
	// If a menu was open, opening follows focus to the adjacent menu.
	if (wasOpen && next !== current) next.click()
}

function onKeydown(e: KeyboardEvent) {
	handlers.onKeydown?.(e)
	const current = e.currentTarget as HTMLElement
	// RTL mirrors the bar: ArrowLeft moves to the next menu, ArrowRight to the previous.
	const fwd = getDirection(current) === 'rtl' ? -1 : 1
	switch (e.key) {
		case 'ArrowRight':
			e.preventDefault()
			focusSibling(current, fwd)
			break
		case 'ArrowLeft':
			e.preventDefault()
			focusSibling(current, -fwd)
			break
		case 'ArrowDown':
		case 'ArrowUp':
			// Open this menu; focus moves into the first submenu item.
			e.preventDefault()
			if (!menu.open.value) menu.openIt()
			break
	}
}
</script>

<template>
	<button
		type="button"
		role="menuitem"
		:disabled="props.disabled"
		aria-haspopup="menu"
		:aria-expanded="menu.open.value"
		:data-state="menu.open.value ? 'open' : 'closed'"
		v-bind="{ ...$attrs, ...dataAttributes }"
		@click="onClick"
		@pointerenter="onPointerEnter"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="onKeydown"
		@keyup="handlers.onKeyup">
		<slot />
	</button>
</template>
