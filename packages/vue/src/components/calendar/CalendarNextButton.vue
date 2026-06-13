<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'CalendarNextButton', inheritAttrs: false })

const ctx = useCalendarContext()
const messages = useWireUIMessages()
const disabled = computed(() => !ctx.canGoNext.value)
const { handlers, dataAttributes } = useInteractiveState({ disabled })

function onClick() {
	ctx.goToMonth(1)
}
</script>

<template>
	<button
		type="button"
		:disabled="disabled"
		:aria-label="messages.calendar.nextMonth"
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
		<slot>›</slot>
	</button>
</template>
