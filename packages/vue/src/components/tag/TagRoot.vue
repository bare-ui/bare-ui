<script setup lang="ts">
defineOptions({ name: 'TagRoot' })

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)
</script>

<template>
	<span :data-disabled="props.disabled ? '' : undefined">
		<slot />
	</span>
</template>
