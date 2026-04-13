<script setup lang="ts">
import { watch, computed } from 'vue';
import { useAvatarContext } from './keys';

defineOptions({ name: 'AvatarImage' })

const props = withDefaults(defineProps<{
	src?: string;
	alt?: string;
}>(), {
	src: undefined,
	alt: undefined,
});

const ctx = useAvatarContext();

watch(
	() => props.src,
	(src) => {
		if (!src) {
			ctx.setImageStatus('error');
		} else {
			ctx.setImageStatus('loading');
		}
	},
	{ immediate: true },
);

const isVisible = computed(() => ctx.imageStatus === 'loaded');

function handleLoad() {
	ctx.setImageStatus('loaded');
}

function handleError() {
	ctx.setImageStatus('error');
}
</script>

<template>
	<img
		v-if="src"
		:src="src"
		:alt="alt"
		:data-status="ctx.imageStatus"
		:style="{ display: isVisible ? undefined : 'none' }"
		@load="handleLoad"
		@error="handleError"
	/>
</template>
