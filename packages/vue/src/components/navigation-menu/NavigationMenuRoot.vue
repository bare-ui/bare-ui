<script setup lang="ts">
import { computed, onUnmounted, provide, ref } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useKeyboard } from '@/composables/use-keyboard'
import { NavigationMenuKey } from './keys'

defineOptions({ name: 'NavigationMenuRoot' })

const props = withDefaults(
	defineProps<{
		value?: string | null
		defaultValue?: string | null
		onValueChange?: (value: string | null) => void
		delayDuration?: number
		skipDelayDuration?: number
		ariaLabel?: string
	}>(),
	{
		defaultValue: null,
		delayDuration: 100,
		skipDelayDuration: 300,
		ariaLabel: 'Main',
	},
)

const value = useControllableState<string | null>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? null,
	onChange: (next) => props.onValueChange?.(next),
})

function setValue(next: string | null) {
	value.value = next
}

const delayDuration = computed(() => props.delayDuration)
const skipDelayDuration = computed(() => props.skipDelayDuration)

// Single shared close timer. Without this, each Trigger and Content owns its
// own local `closeTimer` — so when the cursor moves from Trigger into Content,
// Content's `pointerenter` clears its own (null) timer while Trigger's pending
// close timer keeps running and shuts the menu. Hoisting the timer here lets
// either compound piece cancel a pending close.
let closeTimer: ReturnType<typeof setTimeout> | null = null
function cancelClose() {
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
}
function scheduleClose() {
	cancelClose()
	const target = value.value
	closeTimer = setTimeout(() => {
		closeTimer = null
		if (value.value === target) setValue(null)
	}, skipDelayDuration.value)
}
onUnmounted(cancelClose)

// Set true by a keyboard-driven open (ArrowDown/ArrowUp on a Trigger) so Content
// moves focus to its first link; left false for pointer/hover opens (which must
// not steal focus). A plain flag, mirroring React's focusContentOnOpenRef.
const focusContentOnOpen = ref(false)

const rootRef = ref<HTMLElement | null>(null)
useClickOutside(rootRef, () => {
	if (value.value) setValue(null)
})

useKeyboard(
	{ Escape: () => { if (value.value) setValue(null) } },
	{ event: 'keyup' },
)

provide(NavigationMenuKey, {
	value,
	setValue,
	delayDuration,
	skipDelayDuration,
	cancelClose,
	scheduleClose,
	focusContentOnOpen,
})
</script>

<template>
	<nav
		ref="rootRef"
		:aria-label="props.ariaLabel">
		<slot />
	</nav>
</template>
