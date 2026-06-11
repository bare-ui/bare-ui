<script setup lang="ts">
defineOptions({ name: 'Skeleton' })

const props = withDefaults(
	defineProps<{
		loading?: boolean
		ariaLabel?: string
	}>(),
	{
		loading: true,
		ariaLabel: 'Loading',
	},
)
</script>

<template>
	<slot v-if="!loading" />
	<div
		v-else
		role="status"
		aria-busy="true"
		aria-live="polite"
		:aria-label="props.ariaLabel"
		data-loading="" />
</template>
