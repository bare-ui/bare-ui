<script setup lang="ts">
defineOptions({ name: 'Skeleton' })

withDefaults(
	defineProps<{
		loading?: boolean
		'aria-label'?: string
	}>(),
	{
		loading: true,
		'aria-label': 'Loading',
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
		:aria-label="$props['aria-label']"
		data-loading="" />
</template>
