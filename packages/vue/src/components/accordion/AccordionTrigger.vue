<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { useAccordionContext, useAccordionItemContext } from './keys';

defineOptions({ name: 'AccordionTrigger' })

const ctx = useAccordionContext();
const itemCtx = useAccordionItemContext();

const { handlers, dataAttributes } = useInteractiveState({ disabled: () => itemCtx.disabled });

const isOpen = computed(() => itemCtx.isOpen);
const isDisabled = computed(() => itemCtx.disabled);

const attrs = useAttrs();

function handleClick(e: MouseEvent) {
	ctx.toggle(itemCtx.value);
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:disabled="isDisabled"
		:aria-expanded="isOpen"
		:data-state="isOpen ? 'open' : 'closed'"
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
