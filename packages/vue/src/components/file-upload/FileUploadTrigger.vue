<script setup lang="ts">
import { useFileUploadContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'FileUploadTrigger', inheritAttrs: false })

const ctx = useFileUploadContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled })

function onClick() {
	ctx.openPicker()
}
</script>

<template>
	<button
		type="button"
		:disabled="ctx.disabled.value"
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
