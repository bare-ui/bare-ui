<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';
import { clamp } from './color-utils';

defineOptions({ name: 'ColorPickerAlpha', inheritAttrs: false })

const ctx = useColorPickerContext();
const attrs = useAttrs();

const el = ref<HTMLElement | null>(null);
let dragging = false;

function compute(clientX: number) {
	const element = el.value;
	if (!element) return;
	const rect = element.getBoundingClientRect();
	const x = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
	ctx.setAlpha(x);
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
		ctx.setAlpha(clamp(ctx.hsva.a - 0.01, 0, 1));
	} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
		e.preventDefault();
		ctx.setAlpha(clamp(ctx.hsva.a + 0.01, 0, 1));
	}
}

const alphaStyle = computed(() => {
	const { r, g, b } = ctx.rgba;
	return {
		position: 'relative' as const,
		touchAction: 'none' as const,
		backgroundImage: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgb(${r}, ${g}, ${b}))`,
		...((attrs.style as object) ?? {}),
	};
});
</script>

<template>
	<div
		ref="el"
		role="slider"
		:tabindex="0"
		aria-label="Alpha"
		:aria-valuemin="0"
		:aria-valuemax="1"
		:aria-valuenow="Math.round(ctx.hsva.a * 100) / 100"
		data-color-picker-alpha=""
		v-bind="attrs"
		:style="alphaStyle"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
		@keydown="onKeyDown"
	>
		<slot />
	</div>
</template>
