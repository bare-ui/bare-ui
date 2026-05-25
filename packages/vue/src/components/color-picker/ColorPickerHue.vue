<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';
import { clamp } from './color-utils';

defineOptions({ name: 'ColorPickerHue', inheritAttrs: false })

const HUE_GRADIENT =
	'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

const ctx = useColorPickerContext();
const attrs = useAttrs();

const el = ref<HTMLElement | null>(null);
let dragging = false;

function compute(clientX: number) {
	const element = el.value;
	if (!element) return;
	const rect = element.getBoundingClientRect();
	const x = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
	ctx.setHue(x * 360);
}

function onPointerDown(e: PointerEvent) {
	dragging = true;
	(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	compute(e.clientX);
	(attrs.onPointerdown as ((e: PointerEvent) => void) | undefined)?.(e);
}

function onPointerMove(e: PointerEvent) {
	if (dragging) compute(e.clientX);
	(attrs.onPointermove as ((e: PointerEvent) => void) | undefined)?.(e);
}

function onPointerUp(e: PointerEvent) {
	dragging = false;
	(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	(attrs.onPointerup as ((e: PointerEvent) => void) | undefined)?.(e);
}

function onKeyDown(e: KeyboardEvent) {
	(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e);
	if (e.defaultPrevented) return;
	if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
		e.preventDefault();
		ctx.setHue(clamp(ctx.hsva.h - 1, 0, 360));
	} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
		e.preventDefault();
		ctx.setHue(clamp(ctx.hsva.h + 1, 0, 360));
	}
}

const hueStyle = computed(() => ({
	position: 'relative' as const,
	touchAction: 'none' as const,
	backgroundImage: HUE_GRADIENT,
	...((attrs.style as object) ?? {}),
}));
</script>

<template>
	<div
		ref="el"
		role="slider"
		:tabindex="0"
		aria-label="Hue"
		:aria-valuemin="0"
		:aria-valuemax="360"
		:aria-valuenow="Math.round(ctx.hsva.h)"
		data-color-picker-hue=""
		v-bind="attrs"
		:style="hueStyle"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
		@keydown="onKeyDown"
	>
		<slot />
	</div>
</template>
