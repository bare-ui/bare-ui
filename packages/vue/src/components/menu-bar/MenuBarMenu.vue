<script setup lang="ts">
import { computed, provide } from 'vue'
import { MenuBarMenuKey, useMenuBarContext } from './keys'

defineOptions({ name: 'MenuBarMenu' })

const props = defineProps<{
	value: string
}>()

const bar = useMenuBarContext()
const open = computed(() => bar.openMenu.value === props.value)

function close() {
	bar.setOpenMenu(null)
}

function openIt() {
	bar.setOpenMenu(props.value)
}

function toggle() {
	bar.setOpenMenu(open.value ? null : props.value)
}

provide(MenuBarMenuKey, {
	value: props.value,
	open,
	close,
	openIt,
	toggle,
})
</script>

<template>
	<div :data-state="open ? 'open' : 'closed'">
		<slot />
	</div>
</template>
