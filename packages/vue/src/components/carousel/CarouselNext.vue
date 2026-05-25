<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useCarouselContext } from './keys';

defineOptions({ name: 'CarouselNext', inheritAttrs: false })

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
		aria-label="Next slide"
		:disabled="isDisabled"
		v-bind="attrs"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
