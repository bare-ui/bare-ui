<script setup lang="ts">
import { useMenuBarContext, useMenuBarMenuContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

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
		@keydown="handlers.onKeydown"
		@keyup="handlers.onKeyup">
		<slot />
	</button>
</template>
