<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationMenuContext, useNavigationMenuItemContext } from './keys'

defineOptions({ name: 'NavigationMenuContent' })

const root = useNavigationMenuContext()
const item = useNavigationMenuItemContext()
const open = computed(() => root.value.value === item.value)

function onPointerEnter() {
	// Cancel the pending close started by Trigger's pointerleave.
	// Critical: the close timer lives on Root, not on Content.
	root.cancelClose()
}

function onPointerLeave() {
	root.scheduleClose()
}
</script>

<template>
	<div
		v-if="open"
		role="menu"
		data-state="open"
		@pointerenter="onPointerEnter"
		@pointerleave="onPointerLeave">
		<slot />
	</div>
</template>
