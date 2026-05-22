<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTimeout } from '@/composables/use-timeout';
import { useAvatarContext } from './keys';

defineOptions({ name: 'AvatarFallback' })

const props = withDefaults(defineProps<{
	delayMs?: number;
}>(), {
	delayMs: 0,
});

const ctx = useAvatarContext();

const canRender = ref(props.delayMs === 0);

useTimeout(
	() => { canRender.value = true; },
	() => props.delayMs,
	{ autoStart: props.delayMs > 0 },
);

const shouldRender = computed(() => ctx.imageStatus !== 'loaded' && canRender.value);
</script>

<template>
	<span v-if="shouldRender">
		<slot />
	</span>
</template>
