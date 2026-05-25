<script setup lang="ts">
defineOptions({ name: 'ChatMessage' })

withDefaults(defineProps<{
	role?: 'user' | 'assistant' | 'system' | (string & {});
	streaming?: boolean;
}>(), {
	role: 'user',
	streaming: false,
});
</script>

<template>
	<div
		:data-role="role"
		:data-streaming="streaming ? '' : undefined"
	>
		<slot />
	</div>
</template>
