<script setup lang="ts">
defineOptions({ name: 'BreadcrumbLink', inheritAttrs: false })

withDefaults(
	defineProps<{
		asChild?: boolean
		href?: string
	}>(),
	{
		asChild: false,
	},
)
</script>

<template>
	<slot v-if="asChild" />
	<a
		v-else
		:href="href"
		v-bind="$attrs">
		<slot />
	</a>
</template>
