<script setup lang="ts">
import { provide, reactive, ref } from 'vue';
import { ScrollAreaKey } from './keys';
import type { ScrollAreaContextValue, ScrollAreaMetrics, ScrollAreaOrientation } from './ScrollArea.types';

defineOptions({ name: 'ScrollAreaRoot' })

const viewportRef = ref<HTMLDivElement | null>(null);

const ZERO: ScrollAreaMetrics = {
	scrollTop: 0,
	scrollLeft: 0,
	scrollHeight: 0,
	scrollWidth: 0,
	clientHeight: 0,
	clientWidth: 0,
};

function sameMetrics(a: ScrollAreaMetrics, b: ScrollAreaMetrics): boolean {
	return (
		a.scrollTop === b.scrollTop &&
		a.scrollLeft === b.scrollLeft &&
		a.scrollHeight === b.scrollHeight &&
		a.scrollWidth === b.scrollWidth &&
		a.clientHeight === b.clientHeight &&
		a.clientWidth === b.clientWidth
	);
}

const metrics = reactive<ScrollAreaMetrics>({ ...ZERO });

function updateMetrics() {
	const el = viewportRef.value;
	if (!el) return;
	const next: ScrollAreaMetrics = {
		scrollTop: el.scrollTop,
		scrollLeft: el.scrollLeft,
		scrollHeight: el.scrollHeight,
		scrollWidth: el.scrollWidth,
		clientHeight: el.clientHeight,
		clientWidth: el.clientWidth,
	};
	if (!sameMetrics(metrics, next)) {
		Object.assign(metrics, next);
	}
}

function setScroll(offset: number, orientation: ScrollAreaOrientation) {
	const el = viewportRef.value;
	if (!el) return;
	if (orientation === 'vertical') el.scrollTop = offset;
	else el.scrollLeft = offset;
}

// Provide context — use a plain object (not reactive) so that viewportRef stays
// as a Ref<HTMLDivElement | null> rather than being unwrapped by reactive().
// metrics is already reactive so its fields update consumers reactively.
const ctx: ScrollAreaContextValue = {
	viewportRef,
	metrics,
	updateMetrics,
	setScroll,
};

provide(ScrollAreaKey, ctx);
</script>

<template>
	<div style="position: relative">
		<slot />
	</div>
</template>
