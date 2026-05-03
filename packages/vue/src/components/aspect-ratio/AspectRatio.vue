<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AspectRatio' })

const props = withDefaults(
	defineProps<{
		ratio?: number
	}>(),
	{
		ratio: 1,
	},
)

const wrapperStyle = computed(() => ({
	position: 'relative' as const,
	width: '100%',
	aspectRatio: String(props.ratio),
}))
</script>

<template>
	<div
		:data-ratio="ratio"
		:style="wrapperStyle">
		<slot />
	</div>
</template>
