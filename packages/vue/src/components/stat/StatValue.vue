<script setup lang="ts">
defineOptions({ name: 'StatValue' })

withDefaults(defineProps<{
	value?: number | string;
}>(), {
	value: undefined,
});

defineSlots<{ default?(): unknown }>();
</script>

<template>
	<span>
		<slot>{{ value !== undefined ? value : null }}</slot>
	</span>
</template>
