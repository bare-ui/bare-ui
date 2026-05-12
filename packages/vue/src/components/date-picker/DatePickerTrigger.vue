<script setup lang="ts">
import { useDatePickerContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'DatePickerTrigger', inheritAttrs: false })

const ctx = useDatePickerContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled })

function onClick() {
	ctx.setOpen(!ctx.open.value)
}
</script>

<template>
	<button
		:id="ctx.triggerId"
		type="button"
		:disabled="ctx.disabled.value"
		aria-haspopup="dialog"
		:aria-expanded="ctx.open.value"
		:aria-controls="ctx.contentId"
		:data-state="ctx.open.value ? 'open' : 'closed'"
		v-bind="{ ...$attrs, ...dataAttributes }"
		@click="onClick"
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
