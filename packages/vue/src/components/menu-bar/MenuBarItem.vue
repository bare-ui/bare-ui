<script setup lang="ts">
import { useMenuBarMenuContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'MenuBarItem', inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		disabled?: boolean
		onSelect?: () => void
	}>(),
	{
		disabled: false,
	},
)

const menu = useMenuBarMenuContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })

function select() {
	if (props.disabled) return
	props.onSelect?.()
	menu.close()
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault()
		select()
	}
}
</script>

<template>
	<div
		role="menuitem"
		:tabindex="props.disabled ? -1 : 0"
		:aria-disabled="props.disabled || undefined"
		v-bind="{ ...$attrs, ...dataAttributes }"
		@click="select"
		@keydown="onKeyDown"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keyup="handlers.onKeyup">
		<slot />
	</div>
</template>
