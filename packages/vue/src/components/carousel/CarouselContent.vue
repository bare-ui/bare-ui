<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { useCarouselContext } from './keys';

defineOptions({ name: 'CarouselContent' })

const ctx = useCarouselContext();

const inlineStyle = computed((): CSSProperties => ({
	display: 'flex',
	flexDirection: ctx.orientation === 'vertical' ? 'column' : 'row',
}));
</script>

<template>
	<div
		data-carousel-content=""
		:style="inlineStyle"
	>
		<slot />
	</div>
</template>
