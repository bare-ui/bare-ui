<script setup lang="ts">
import { useComboboxContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'ComboboxTrigger', inheritAttrs: false })

const ctx = useComboboxContext()
const messages = useWireUIMessages()
const { handlers, dataAttributes } = useInteractiveState({ disabled: ctx.disabled })

function onClick() {
	ctx.setOpen(!ctx.open.value)
}
</script>

<template>
	<button
		type="button"
		tabindex="-1"
		:disabled="ctx.disabled.value"
		:aria-label="messages.combobox.toggle"
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
