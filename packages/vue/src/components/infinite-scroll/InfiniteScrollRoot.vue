<script setup lang="ts">
import { provide, reactive, computed } from 'vue';
import { InfiniteScrollKey } from './keys';
import type { InfiniteScrollRootProps } from './InfiniteScroll.types';

defineOptions({ name: 'InfiniteScrollRoot' })

const props = withDefaults(defineProps<Omit<InfiniteScrollRootProps, 'class'>>(), {
	hasMore: true,
	loading: false,
	rootMargin: '0px',
	disabled: false,
});

function loadMore() {
	props.onLoadMore();
}

provide(InfiniteScrollKey, reactive({
	hasMore: computed(() => props.hasMore),
	loading: computed(() => props.loading),
	disabled: computed(() => props.disabled),
	rootMargin: computed(() => props.rootMargin),
	loadMore,
}));
</script>

<template>
	<div
		:data-loading="loading ? '' : undefined"
		:data-has-more="hasMore ? '' : undefined"
	>
		<slot />
	</div>
</template>
