<script setup lang="ts">
defineOptions({ name: 'Spinner' })

withDefaults(
	defineProps<{
		label?: string
		decorative?: boolean
	}>(),
	{
		label: 'Loading',
		decorative: true,
	},
)

const visuallyHidden = {
	position: 'absolute' as const,
	width: '1px',
	height: '1px',
	padding: 0,
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0,0,0,0)',
	whiteSpace: 'nowrap' as const,
	borderWidth: 0,
}
</script>

<template>
	<span
		role="status"
		aria-live="polite"
		:aria-label="label">
		<span :aria-hidden="decorative ? 'true' : undefined">
			<slot />
		</span>
		<span :style="visuallyHidden">{{ label }}</span>
	</span>
</template>
