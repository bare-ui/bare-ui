<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useColorPickerContext } from './keys';

defineOptions({ name: 'ColorPickerSwatch', inheritAttrs: false })

const ctx = useColorPickerContext();
const attrs = useAttrs();

const swatchStyle = computed(() => {
	const { r, g, b, a } = ctx.rgba;
	return {
		backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
		...((attrs.style as object) ?? {}),
	};
});
</script>

<template>
	<div
		data-color-picker-swatch=""
		v-bind="attrs"
		:style="swatchStyle"
	/>
</template>
