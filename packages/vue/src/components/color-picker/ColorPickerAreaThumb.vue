<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';

defineOptions({ name: 'ColorPickerAreaThumb', inheritAttrs: false })

const ctx = useColorPickerContext();
const attrs = useAttrs();

const thumbStyle = computed(() => ({
	position: 'absolute' as const,
	left: `${ctx.hsva.s}%`,
	top: `${100 - ctx.hsva.v}%`,
	transform: 'translate(-50%, -50%)',
	pointerEvents: 'none' as const,
	...((attrs.style as object) ?? {}),
}));
</script>

<template>
	<div
		data-color-picker-area-thumb=""
		v-bind="attrs"
		:style="thumbStyle"
	/>
</template>
