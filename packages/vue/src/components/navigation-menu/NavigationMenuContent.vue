<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNavigationMenuContext, useNavigationMenuItemContext } from './keys'

defineOptions({ name: 'NavigationMenuContent' })

// Matches the first focusable link/control inside the content (mirrors React).
const FOCUSABLE_IN_CONTENT = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'

const root = useNavigationMenuContext()
const item = useNavigationMenuItemContext()
const open = computed(() => root.value.value === item.value)

const contentRef = ref<HTMLDivElement | null>(null)

// When opened from the keyboard, move focus to the first link. Pointer/hover
// opens leave the flag false so the cursor isn't yanked away. `flush: 'post'`
// runs after the DOM updates so the content element exists to query. The flag
// is only ever set by client keydown handlers, so this never runs during SSR.
watch(open, (isOpen) => {
	if (!isOpen || !root.focusContentOnOpen.value) return
	root.focusContentOnOpen.value = false
	contentRef.value?.querySelector<HTMLElement>(FOCUSABLE_IN_CONTENT)?.focus()
}, { flush: 'post' })

function onPointerEnter() {
	// Cancel the pending close started by Trigger's pointerleave.
	// Critical: the close timer lives on Root, not on Content.
	root.cancelClose()
}

function onPointerLeave() {
	root.scheduleClose()
}

function returnFocusToTrigger() {
	const trigger = contentRef.value
		?.closest('li')
		?.querySelector<HTMLElement>('[aria-haspopup="menu"]')
	trigger?.focus()
}

function onKeydown(event: KeyboardEvent) {
	// Escape closes and returns focus to the trigger (APG disclosure nav).
	if (event.key === 'Escape') {
		returnFocusToTrigger()
		root.setValue(null)
	}
}
</script>

<template>
	<div
		v-if="open"
		ref="contentRef"
		role="menu"
		data-state="open"
		@pointerenter="onPointerEnter"
		@pointerleave="onPointerLeave"
		@keydown="onKeydown">
		<slot />
	</div>
</template>
