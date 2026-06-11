<script setup lang="ts">
defineOptions({ name: 'BreadcrumbRoot' })

const props = withDefaults(
	defineProps<{
		ariaLabel?: string
	}>(),
	{
		ariaLabel: 'Breadcrumb',
	},
)
</script>

<template>
	<nav :aria-label="props.ariaLabel">
		<slot />
	</nav>
</template>
