<script setup lang="ts">
import { computed } from 'vue'
import { usePaginationContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'PaginationNext', inheritAttrs: false })

const messages = useWireUIMessages()

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const ctx = usePaginationContext()
const isDisabled = computed(() => props.disabled || !ctx.canNext.value)
const { handlers, dataAttributes } = useInteractiveState({ disabled: isDisabled })

function onClick() {
	ctx.next()
}
</script>

<template>
	<button
		type="button"
		:disabled="isDisabled"
		:aria-label="messages.pagination.next"
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
