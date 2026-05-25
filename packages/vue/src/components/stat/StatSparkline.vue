<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'StatSparkline' })

const props = withDefaults(defineProps<{
	data: number[];
	width?: number;
	height?: number;
	strokeWidth?: number;
}>(), {
	width: 100,
	height: 24,
	strokeWidth: 1.5,
});

const points = computed(() => {
	const { data, width, height, strokeWidth } = props;
	if (data.length < 2) return null;

	const min = Math.min(...data);
	const max = Math.max(...data);
	const span = max - min;
	const stepX = width / (data.length - 1);
	const pad = strokeWidth / 2;
	const usableHeight = height - strokeWidth;

	return data
		.map((v, i) => {
			const x = i * stepX;
			const y = span === 0 ? height / 2 : pad + usableHeight - ((v - min) / span) * usableHeight;
			return `${x.toFixed(2)},${y.toFixed(2)}`;
		})
		.join(' ');
});
</script>

<template>
	<svg
		v-if="points !== null"
		:viewBox="`0 0 ${width} ${height}`"
		:width="width"
		:height="height"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<polyline
			:points="points"
			fill="none"
			stroke="currentColor"
			:stroke-width="strokeWidth"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>
