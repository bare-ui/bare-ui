<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useNavigationMenuContext, useNavigationMenuItemContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'NavigationMenuTrigger', inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const root = useNavigationMenuContext()
const item = useNavigationMenuItemContext()
const open = computed(() => root.value.value === item.value)
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })

let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
	if (openTimer) {
		clearTimeout(openTimer)
		openTimer = null
	}
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
}

onUnmounted(clearTimers)

function onClick() {
	clearTimers()
	root.setValue(open.value ? null : item.value)
}

function onPointerEnter() {
	clearTimers()
	if (root.value.value !== null && root.value.value !== item.value) {
		root.setValue(item.value)
	} else {
		openTimer = setTimeout(() => root.setValue(item.value), root.delayDuration.value)
	}
}

function onPointerLeave() {
	clearTimers()
	closeTimer = setTimeout(() => {
		if (root.value.value === item.value) root.setValue(null)
	}, root.skipDelayDuration.value)
}
</script>

<template>
	<button
		type="button"
		:disabled="props.disabled"
		aria-haspopup="menu"
		:aria-expanded="open"
		:data-state="open ? 'open' : 'closed'"
		v-bind="{ ...$attrs, ...dataAttributes }"
		@click="onClick"
		@pointerenter="onPointerEnter"
		@pointerleave="onPointerLeave"
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
