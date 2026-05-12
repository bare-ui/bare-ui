<script setup lang="ts">
defineOptions({ name: 'NavigationMenuLink', inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		active?: boolean
		href?: string
	}>(),
	{
		active: false,
	},
)
</script>

<template>
	<a
		:href="href"
		:aria-current="props.active ? 'page' : undefined"
		:data-active="props.active ? '' : undefined"
		v-bind="$attrs">
		<slot />
	</a>
</template>
