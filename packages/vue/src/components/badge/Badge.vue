<script setup lang="ts">
defineOptions({ name: 'Badge' })

const props = withDefaults(
	defineProps<{
		count?: number
	}>(),
	{ count: 0 },
)

const displayCount = () => (props.count > 0 ? (props.count > 9 ? '9+' : props.count) : 0)
</script>

<template>
	<span :data-count="count">{{ displayCount() }}</span>
</template>
