<script setup lang="ts">
defineOptions({ name: 'BreadcrumbRoot' })

withDefaults(
	defineProps<{
		'aria-label'?: string
	}>(),
	{
		'aria-label': 'Breadcrumb',
	},
)
</script>

<template>
	<nav :aria-label="$props['aria-label']">
		<slot />
	</nav>
</template>
