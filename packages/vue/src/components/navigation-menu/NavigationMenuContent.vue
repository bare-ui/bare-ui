<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationMenuContext, useNavigationMenuItemContext } from './keys'

defineOptions({ name: 'NavigationMenuContent' })

const root = useNavigationMenuContext()
const item = useNavigationMenuItemContext()
const open = computed(() => root.value.value === item.value)

let closeTimer: ReturnType<typeof setTimeout> | null = null

function onPointerEnter() {
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
}

function onPointerLeave() {
	closeTimer = setTimeout(() => {
		if (root.value.value === item.value) root.setValue(null)
	}, root.skipDelayDuration.value)
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
