<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useCarouselContext } from './keys';
import { useWireUIMessages } from '@/context/wire-ui-context';

defineOptions({ name: 'CarouselNext', inheritAttrs: false })

const messages = useWireUIMessages();

const props = withDefaults(defineProps<{
	disabled?: boolean;
}>(), {
	disabled: undefined,
});

const ctx = useCarouselContext();
const attrs = useAttrs();

const isDisabled = computed(() => props.disabled ?? !ctx.canScrollNext);

function handleClick(e: MouseEvent) {
	ctx.scrollNext();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		:aria-label="messages.carousel.next"
		:disabled="isDisabled"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
