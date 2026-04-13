<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'ProgressBar' })

const props = withDefaults(
	defineProps<{
		percentage?: number
		size?: string
	}>(),
	{
		percentage: 0,
		size: 'medium',
	},
)

const clamped = computed(() => Math.min(100, Math.max(0, props.percentage)))
</script>

<template>
	<div
		role="progressbar"
		:aria-valuenow="clamped"
		:aria-valuemin="0"
		:aria-valuemax="100"
		:data-size="size"
	>
		<div data-part="fill" :style="{ width: `${clamped}%` }" />
	</div>
</template>
