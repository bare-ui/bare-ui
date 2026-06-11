<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'TagRemove', inheritAttrs: false })

const { handlers, dataAttributes } = useInteractiveState()
</script>

<template>
	<button
		type="button"
		aria-label="Remove"
		v-bind="{ ...$attrs, ...dataAttributes }"
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
