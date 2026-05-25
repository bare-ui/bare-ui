<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useCarouselContext } from './keys';

defineOptions({ name: 'CarouselPrevious', inheritAttrs: false })

const props = withDefaults(defineProps<{
	disabled?: boolean;
}>(), {
	disabled: undefined,
});

const ctx = useCarouselContext();
const attrs = useAttrs();

const isDisabled = computed(() => props.disabled ?? !ctx.canScrollPrev);

function handleClick(e: MouseEvent) {
	ctx.scrollPrev();
	(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);
}
</script>

<template>
	<button
		type="button"
		aria-label="Previous slide"
		:disabled="isDisabled"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
