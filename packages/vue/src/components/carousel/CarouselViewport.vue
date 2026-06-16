<script setup lang="ts">
import { computed, useAttrs, onMounted, onBeforeUnmount, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { useCarouselContext } from './keys';
import { getDirection } from '@/composables/use-direction';

defineOptions({ name: 'CarouselViewport', inheritAttrs: false })

const ctx = useCarouselContext();
const attrs = useAttrs();
const el = ref<HTMLDivElement | null>(null);

const vertical = computed(() => ctx.orientation === 'vertical');

const inlineStyle = computed((): CSSProperties => ({
	overflowX: vertical.value ? 'hidden' : 'auto',
	overflowY: vertical.value ? 'auto' : 'hidden',
	scrollSnapType: vertical.value ? 'y mandatory' : 'x mandatory',
	scrollbarWidth: 'none',
}));

onMounted(() => {
	ctx.setViewportEl(el.value);
});

onBeforeUnmount(() => {
	ctx.setViewportEl(null);
});

function onScroll(e: Event) {
	ctx.updateCurrent();
	(attrs.onScroll as ((e: Event) => void) | undefined)?.(e);
}

function onKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	const rtl = !vertical.value && getDirection(e.currentTarget as Element) === 'rtl';
	const nextKey = vertical.value ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
	const prevKey = vertical.value ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
	if (e.key === nextKey) {
		e.preventDefault();
		ctx.scrollNext();
	} else if (e.key === prevKey) {
		e.preventDefault();
		ctx.scrollPrev();
	}
}
</script>

<template>
	<div
		ref="el"
		data-carousel-viewport=""
		:style="inlineStyle"
		v-bind="attrs"
		@scroll="onScroll"
		@keydown="onKeyDown"
	>
		<slot />
	</div>
</template>
