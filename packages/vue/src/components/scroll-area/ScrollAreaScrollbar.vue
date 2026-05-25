<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useScrollAreaContext, ScrollbarKey } from './keys';
import type { ScrollbarContextValue } from './ScrollArea.types';

defineOptions({ name: 'ScrollAreaScrollbar' })

const props = withDefaults(defineProps<{
	orientation?: 'vertical' | 'horizontal';
	forceMount?: boolean;
}>(), {
	orientation: 'vertical',
	forceMount: false,
});

const ctx = useScrollAreaContext();

const trackRef = ref<HTMLDivElement | null>(null);

const hasOverflow = computed(() => {
	if (props.orientation === 'vertical') {
		return ctx.metrics.scrollHeight > ctx.metrics.clientHeight;
	}
	return ctx.metrics.scrollWidth > ctx.metrics.clientWidth;
});

const edgeStyle = computed(() => {
	if (props.orientation === 'vertical') {
		return 'position: absolute; top: 0; right: 0; bottom: 0';
	}
	return 'position: absolute; left: 0; right: 0; bottom: 0';
});

// Provide scrollbar context as a plain object — trackRef stays as a Ref
const sbCtx: ScrollbarContextValue = {
	orientation: props.orientation,
	trackRef,
};

provide(ScrollbarKey, sbCtx);
</script>

<template>
	<div
		v-if="forceMount || hasOverflow"
		:ref="(el) => { trackRef = el as HTMLDivElement | null }"
		data-scroll-area-scrollbar=""
		:data-orientation="orientation"
		:data-state="hasOverflow ? 'visible' : 'hidden'"
		:style="edgeStyle"
	>
		<slot />
	</div>
</template>
