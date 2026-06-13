<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';
import { useWireUIMessages } from '@/context/wire-ui-context';
import { clamp } from './color-utils';

defineOptions({ name: 'ColorPickerArea', inheritAttrs: false })

const ctx = useColorPickerContext();
const messages = useWireUIMessages();
const attrs = useAttrs();

const el = ref<HTMLElement | null>(null);
let dragging = false;

function compute(clientX: number, clientY: number) {
	const element = el.value;
	if (!element) return;
	const rect = element.getBoundingClientRect();
	const x = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
	const y = clamp((clientY - rect.top) / (rect.height || 1), 0, 1);
	ctx.setSaturationValue(x * 100, (1 - y) * 100);
}

function onPointerDown(e: PointerEvent) {
	dragging = true;
	(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	compute(e.clientX, e.clientY);
	(attrs.onPointerdown as ((e: PointerEvent) => void) | undefined)?.(e);
}

function onPointerMove(e: PointerEvent) {
	if (dragging) compute(e.clientX, e.clientY);
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
	const { s, v } = ctx.hsva;
	if (e.key === 'ArrowLeft') {
		e.preventDefault();
		ctx.setSaturationValue(clamp(s - 1, 0, 100), v);
	} else if (e.key === 'ArrowRight') {
		e.preventDefault();
		ctx.setSaturationValue(clamp(s + 1, 0, 100), v);
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		ctx.setSaturationValue(s, clamp(v + 1, 0, 100));
	} else if (e.key === 'ArrowDown') {
		e.preventDefault();
		ctx.setSaturationValue(s, clamp(v - 1, 0, 100));
	}
}
</script>

<template>
	<div
		ref="el"
		role="slider"
		:tabindex="0"
		:aria-label="messages.colorPicker.saturationAndBrightness"
		:aria-valuetext="`Saturation ${Math.round(ctx.hsva.s)}%, brightness ${Math.round(ctx.hsva.v)}%`"
		data-color-picker-area=""
		v-bind="attrs"
		:style="{
			position: 'relative',
			touchAction: 'none',
			backgroundColor: ctx.hueColor,
			backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
			...((attrs.style as object) ?? {}),
		}"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
		@keydown="onKeyDown"
	>
		<slot />
	</div>
</template>
