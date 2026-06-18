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

// Open-delay timer is per-trigger (it's tied to this element's hover intent).
// The close timer lives on Root so Content can cancel it — see Root.
let openTimer: ReturnType<typeof setTimeout> | null = null

function clearOpenTimer() {
	if (openTimer) {
		clearTimeout(openTimer)
		openTimer = null
	}
}

onUnmounted(clearOpenTimer)

function onClick() {
	clearOpenTimer()
	root.cancelClose()
	root.setValue(open.value ? null : item.value)
}

function onPointerEnter() {
	clearOpenTimer()
	root.cancelClose()
	if (root.value.value !== null && root.value.value !== item.value) {
		root.setValue(item.value)
	} else {
		openTimer = setTimeout(() => root.setValue(item.value), root.delayDuration.value)
	}
}

function onPointerLeave() {
	clearOpenTimer()
	root.scheduleClose()
}

function onKeydown(event: KeyboardEvent) {
	// ArrowDown/ArrowUp open the menu and move focus into its first link.
	if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
		event.preventDefault()
		clearOpenTimer()
		root.cancelClose()
		root.focusContentOnOpen.value = true
		root.setValue(item.value)
	}
	handlers.onKeydown(event)
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
		@keydown="onKeydown"
		@keyup="handlers.onKeyup">
		<slot />
	</button>
</template>
