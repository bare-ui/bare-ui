<script setup lang="ts">
defineOptions({ name: 'BreadcrumbItem' })

const props = withDefaults(
	defineProps<{
		current?: boolean
	}>(),
	{
		current: false,
	},
)
</script>

<template>
	<li
		:aria-current="props.current ? 'page' : undefined"
		:data-current="props.current ? '' : undefined">
		<slot />
	</li>
</template>
