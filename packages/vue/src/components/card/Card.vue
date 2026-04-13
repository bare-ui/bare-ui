<script setup lang="ts">
defineOptions({ name: 'Card' })

defineProps<{
	color?: string
	size?: string
}>()
</script>

<template>
	<div :data-color="color" :data-size="size">
		<slot />
	</div>
</template>
