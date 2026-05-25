<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useScrollAreaContext, useScrollbarContext } from './keys';

defineOptions({ name: 'ScrollAreaThumb', inheritAttrs: false })

const attrs = useAttrs();
const ctx = useScrollAreaContext();
const sb = useScrollbarContext();

const vertical = computed(() => sb.orientation === 'vertical');

const clientLen = computed(() => vertical.value ? ctx.metrics.clientHeight : ctx.metrics.clientWidth);
const scrollLen = computed(() => vertical.value ? ctx.metrics.scrollHeight : ctx.metrics.scrollWidth);
const scrollOffset = computed(() => vertical.value ? ctx.metrics.scrollTop : ctx.metrics.scrollLeft);
const maxScroll = computed(() => Math.max(scrollLen.value - clientLen.value, 0));
const sizePct = computed(() =>
	scrollLen.value > 0 ? Math.min(100, (clientLen.value / scrollLen.value) * 100) : 100
);
const offsetPct = computed(() =>
	maxScroll.value > 0 ? (scrollOffset.value / maxScroll.value) * (100 - sizePct.value) : 0
);

const thumbStyle = computed(() => {
	if (vertical.value) {
		return `position: absolute; right: 0; left: 0; height: ${sizePct.value}%; top: ${offsetPct.value}%`;
	}
	return `position: absolute; top: 0; bottom: 0; width: ${sizePct.value}%; left: ${offsetPct.value}%`;
});

// Drag state — plain mutable ref (not reactive, doesn't drive rendering)
let dragState: { start: number; startScroll: number } | null = null;

function handlePointerDown(e: PointerEvent) {
	const attrHandler = (attrs as Record<string, unknown>).onPointerdown;
	if (typeof attrHandler === 'function') (attrHandler as (e: PointerEvent) => void)(e);
	if (e.defaultPrevented) return;
	e.preventDefault();
	dragState = {
		start: vertical.value ? e.clientY : e.clientX,
		startScroll: scrollOffset.value,
	};
	(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}

function handlePointerMove(e: PointerEvent) {
	const attrHandler = (attrs as Record<string, unknown>).onPointermove;
	if (typeof attrHandler === 'function') (attrHandler as (e: PointerEvent) => void)(e);
	if (!dragState) return;
	const track = sb.trackRef.value;
	if (!track) return;
	const rect = track.getBoundingClientRect();
	const trackPx = vertical.value ? rect.height : rect.width;
	const thumbPx = (sizePct.value / 100) * trackPx;
	const scrollableTrack = trackPx - thumbPx;
	if (scrollableTrack <= 0) return;
	const delta = (vertical.value ? e.clientY : e.clientX) - dragState.start;
	const next = dragState.startScroll + (delta / scrollableTrack) * maxScroll.value;
	ctx.setScroll(next, sb.orientation);
}

function handlePointerUp(e: PointerEvent) {
	const attrHandler = (attrs as Record<string, unknown>).onPointerup;
	if (typeof attrHandler === 'function') (attrHandler as (e: PointerEvent) => void)(e);
	if (!dragState) return;
	(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	dragState = null;
}

function handlePointerCancel(e: PointerEvent) {
	const attrHandler = (attrs as Record<string, unknown>).onPointercancel;
	if (typeof attrHandler === 'function') (attrHandler as (e: PointerEvent) => void)(e);
	if (!dragState) return;
	(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	dragState = null;
}
</script>

<template>
	<div
		data-scroll-area-thumb=""
		:data-orientation="sb.orientation"
		:style="thumbStyle"
		v-bind="attrs"
		@pointerdown="handlePointerDown"
		@pointermove="handlePointerMove"
		@pointerup="handlePointerUp"
		@pointercancel="handlePointerCancel"
	/>
</template>
