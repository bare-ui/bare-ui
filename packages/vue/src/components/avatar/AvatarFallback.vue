<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAvatarContext } from './keys';

defineOptions({ name: 'AvatarFallback' })

const props = withDefaults(defineProps<{
	delayMs?: number;
}>(), {
	delayMs: 0,
});

const ctx = useAvatarContext();

const canRender = ref(props.delayMs === 0);
let timer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
	if (props.delayMs > 0) {
		timer = setTimeout(() => {
			canRender.value = true;
		}, props.delayMs);
	}
});

onUnmounted(() => {
	if (timer) clearTimeout(timer);
});

const shouldRender = computed(() => ctx.imageStatus !== 'loaded' && canRender.value);
</script>

<template>
	<span v-if="shouldRender">
		<slot />
	</span>
</template>
