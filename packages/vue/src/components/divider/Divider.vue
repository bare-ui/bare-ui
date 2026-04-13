<script setup lang="ts">
defineOptions({ name: 'Divider' })

const props = withDefaults(
	defineProps<{
		orientation?: 'horizontal' | 'vertical'
		decorative?: boolean
	}>(),
	{
		orientation: 'horizontal',
		decorative: true,
	},
)
</script>

<template>
	<div
		:data-orientation="orientation"
		:role="props.decorative ? 'none' : 'separator'"
		:aria-hidden="props.decorative ? true : undefined"
		:aria-orientation="props.decorative ? undefined : orientation"
	/>
</template>
