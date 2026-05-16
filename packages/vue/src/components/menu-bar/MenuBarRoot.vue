<script setup lang="ts">
import { provide, useTemplateRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useKeyboard } from '@/composables/use-keyboard'
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

const openMenu = useControllableState<string | null>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? null,
	onChange: (next) => props.onValueChange?.(next),
})

function setOpenMenu(next: string | null) {
	openMenu.value = next
}

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
useClickOutside(rootRef, () => {
	if (openMenu.value) setOpenMenu(null)
})

useKeyboard(
	{ Escape: () => { if (openMenu.value) setOpenMenu(null) } },
	{ event: 'keyup' },
)

provide(MenuBarKey, { openMenu, setOpenMenu })
</script>

<template>
	<div
		ref="rootRef"
		role="menubar">
		<slot />
	</div>
</template>
