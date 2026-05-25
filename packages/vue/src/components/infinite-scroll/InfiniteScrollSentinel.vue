<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useIntersectionObserver } from '@/composables/use-intersection-observer';
import { useInfiniteScrollContext } from './keys';

defineOptions({ name: 'InfiniteScrollSentinel' })

const ctx = useInfiniteScrollContext();

const el = ref<HTMLDivElement | null>(null);

// enabled is reactive — the composable watches it and reconnects the observer
const enabled = computed(() => ctx.hasMore && !ctx.disabled);

const entry = useIntersectionObserver(el, {
	// rootMargin is read once at composable setup; typical usage keeps it constant
	get rootMargin() { return ctx.rootMargin; },
	enabled,
});

watch(
	() => entry.value?.isIntersecting,
	(isIntersecting) => {
		if (isIntersecting && ctx.hasMore && !ctx.loading && !ctx.disabled) {
			ctx.loadMore();
		}
	},
);
</script>

<template>
	<div
		ref="el"
		data-infinite-scroll-sentinel=""
		aria-hidden="true"
	/>
</template>
