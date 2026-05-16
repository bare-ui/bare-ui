<script setup lang="ts">
import { computed, provide, ref } from 'vue'
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
		'aria-label'?: string
	}>(),
	{
		defaultValue: null,
		delayDuration: 100,
		skipDelayDuration: 300,
		'aria-label': 'Main',
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
})
</script>

<template>
	<nav
		ref="rootRef"
		:aria-label="$props['aria-label']">
		<slot />
	</nav>
</template>
