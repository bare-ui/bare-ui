<script setup lang="ts">
import { computed } from 'vue'
import { useNumberInputContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'NumberInputDecrement', inheritAttrs: false })

const ctx = useNumberInputContext()

const atBoundary = computed(
	() => ctx.value.value !== null && ctx.value.value <= ctx.min.value,
)
const isDisabled = computed(() => ctx.disabled.value || ctx.readOnly.value || atBoundary.value)

const { handlers, dataAttributes } = useInteractiveState({ disabled: isDisabled })

function onClick() {
	ctx.decrement()
}
</script>

<template>
	<button
		type="button"
		tabindex="-1"
		:disabled="isDisabled"
		aria-label="Decrement"
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
