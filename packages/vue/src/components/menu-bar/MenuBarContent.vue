<script setup lang="ts">
import { ref } from 'vue'
import { useMenuBarMenuContext } from './keys'
import { useMenuNavigation } from '@/composables/use-menu-navigation'

defineOptions({ name: 'MenuBarContent' })

const menu = useMenuBarMenuContext()
const menuRef = ref<HTMLElement | null>(null)
const { onKeyDown } = useMenuNavigation(menuRef, {
	open: menu.open,
	onClose: menu.close,
})
</script>

<template>
	<div
		v-if="menu.open.value"
		ref="menuRef"
		role="menu"
		data-state="open"
		@keydown="onKeyDown">
		<slot />
	</div>
</template>
