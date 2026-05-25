<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';

defineOptions({ name: 'ColorPickerHueThumb', inheritAttrs: false })

const ctx = useColorPickerContext();
const attrs = useAttrs();

const thumbStyle = computed(() => ({
	position: 'absolute' as const,
	left: `${(ctx.hsva.h / 360) * 100}%`,
	top: '50%',
	transform: 'translate(-50%, -50%)',
	pointerEvents: 'none' as const,
	...((attrs.style as object) ?? {}),
}));
</script>

<template>
	<div
		data-color-picker-hue-thumb=""
		v-bind="attrs"
		:style="thumbStyle"
	/>
</template>
