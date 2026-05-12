<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { MenuBarKey } from './keys'

defineOptions({ name: 'MenuBarRoot' })

const props = withDefaults(
	defineProps<{
		value?: string | null
		defaultValue?: string | null
		onValueChange?: (value: string | null) => void
	}>(),
	{
		defaultValue: null,
	},
)

const uncontrolled = ref<string | null>(props.defaultValue ?? null)
const isControlled = computed(() => props.value !== undefined)
const openMenu = computed<string | null>(() =>
	isControlled.value ? (props.value as string | null) : uncontrolled.value,
)

function setOpenMenu(next: string | null) {
	if (!isControlled.value) uncontrolled.value = next
	props.onValueChange?.(next)
}

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
useClickOutside(rootRef, () => {
	if (openMenu.value) setOpenMenu(null)
})

function onKeyUp(e: KeyboardEvent) {
	if (e.key === 'Escape' && openMenu.value) setOpenMenu(null)
}

onMounted(() => window.addEventListener('keyup', onKeyUp))
onUnmounted(() => window.removeEventListener('keyup', onKeyUp))

provide(MenuBarKey, { openMenu, setOpenMenu })
</script>

<template>
	<div
		ref="rootRef"
		role="menubar">
		<slot />
	</div>
</template>
