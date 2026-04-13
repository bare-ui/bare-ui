<script setup lang="ts">
defineOptions({ name: 'List' })

const props = withDefaults(
	defineProps<{
		isOrdered?: boolean
		type?: string
		size?: string
	}>(),
	{ isOrdered: false },
)
</script>

<template>
	<component
		:is="props.isOrdered ? 'ol' : 'ul'"
		:data-type="type"
		:data-size="size"
		:data-striped="type === 'striped' ? '' : undefined"
		:data-divider="type === 'divider' ? '' : undefined"
	>
		<slot />
	</component>
</template>
