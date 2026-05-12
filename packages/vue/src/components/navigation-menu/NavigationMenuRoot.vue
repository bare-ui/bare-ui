<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
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

const uncontrolled = ref<string | null>(props.defaultValue ?? null)
const isControlled = computed(() => props.value !== undefined)
const value = computed<string | null>(() =>
	isControlled.value ? (props.value as string | null) : uncontrolled.value,
)

function setValue(next: string | null) {
	if (!isControlled.value) uncontrolled.value = next
	props.onValueChange?.(next)
}

const delayDuration = computed(() => props.delayDuration)
const skipDelayDuration = computed(() => props.skipDelayDuration)

const rootRef = ref<HTMLElement | null>(null)
useClickOutside(rootRef, () => {
	if (value.value) setValue(null)
})

function onKeyUp(e: KeyboardEvent) {
	if (e.key === 'Escape' && value.value) setValue(null)
}

onMounted(() => window.addEventListener('keyup', onKeyUp))
onUnmounted(() => window.removeEventListener('keyup', onKeyUp))

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
