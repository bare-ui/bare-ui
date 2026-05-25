<script setup lang="ts">
import { useInteractiveState } from '@/composables/use-interactive-state';
import { useSheetContext } from './keys';

defineOptions({ name: 'SheetTrigger' })

const ctx = useSheetContext()
const { handlers, dataAttributes } = useInteractiveState()
</script>

<template>
	<button
		type="button"
		aria-haspopup="dialog"
		:aria-expanded="ctx.open"
		v-bind="dataAttributes"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="handlers.onKeydown"
		@keyup="handlers.onKeyup"
		@click="ctx.setOpen(true)"
	>
		<slot />
	</button>
</template>
