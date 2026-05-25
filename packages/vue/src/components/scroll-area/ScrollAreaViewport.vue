<script setup lang="ts">
import { onMounted, onUnmounted, useAttrs, watch } from 'vue';
import { useScrollAreaContext } from './keys';

defineOptions({ name: 'ScrollAreaViewport', inheritAttrs: false })

const attrs = useAttrs();
const ctx = useScrollAreaContext();

let ro: ResizeObserver | null = null;

function setupObserver() {
	if (ro) {
		ro.disconnect();
		ro = null;
	}
	const el = ctx.viewportRef.value;
	if (!el) return;
	ctx.updateMetrics();
	if (typeof ResizeObserver === 'undefined') return;
	ro = new ResizeObserver(() => ctx.updateMetrics());
	ro.observe(el);
	if (el.firstElementChild) ro.observe(el.firstElementChild);
}

onMounted(() => {
	setupObserver();
});

onUnmounted(() => {
	if (ro) {
		ro.disconnect();
		ro = null;
	}
});

watch(() => ctx.viewportRef.value, () => {
	setupObserver();
});

function handleScroll(e: Event) {
	ctx.updateMetrics();
	const attrOnScroll = (attrs as Record<string, unknown>).onScroll;
	if (typeof attrOnScroll === 'function') (attrOnScroll as (e: Event) => void)(e);
}
</script>

<template>
	<div
		:ref="(el) => { ctx.viewportRef.value = el as HTMLDivElement | null }"
		data-scroll-area-viewport=""
		style="overflow: auto; scrollbar-width: none"
		v-bind="attrs"
		@scroll="handleScroll"
	>
		<slot />
	</div>
</template>
