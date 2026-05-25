<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useCarouselContext } from './keys';

defineOptions({ name: 'CarouselSlide' })

const ctx = useCarouselContext();
const slideEl = ref<HTMLElement | null>(null);

let cleanup: (() => void) | undefined;

onMounted(() => {
	const el = slideEl.value;
	if (el) {
		cleanup = ctx.registerSlide(el);
	}
});

onBeforeUnmount(() => {
	cleanup?.();
});
</script>

<template>
	<div
		ref="slideEl"
		role="group"
		aria-roledescription="slide"
		data-carousel-slide=""
		:style="{ scrollSnapAlign: 'start', flexShrink: 0 }"
	>
		<slot />
	</div>
</template>
