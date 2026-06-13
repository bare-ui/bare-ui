<script setup lang="ts">
import { useAttrs } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { useWireUIMessages } from '@/context/wire-ui-context';
import { useAlertContext } from './keys';

defineOptions({ name: 'AlertDismiss' })

const ctx = useAlertContext();
const messages = useWireUIMessages();
const { handlers, dataAttributes } = useInteractiveState();

const attrs = useAttrs();

function handleClick(e: MouseEvent) {
	ctx.dismiss();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:aria-label="messages.alert.dismiss"
		v-bind="dataAttributes"
		@mouseenter="handlers.onMouseenter"
		@mouseleave="handlers.onMouseleave"
		@focus="handlers.onFocus"
		@blur="handlers.onBlur"
		@pointerdown="handlers.onPointerdown"
		@pointerup="handlers.onPointerup"
		@keydown="handlers.onKeydown"
		@keyup="handlers.onKeyup"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
