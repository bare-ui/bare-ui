<script setup lang="ts">
import { useInfiniteScrollContext } from './keys';

defineOptions({ name: 'InfiniteScrollLoader' })

const ctx = useInfiniteScrollContext();
</script>

<template>
	<div
		v-if="ctx.loading"
		role="status"
		aria-live="polite"
	>
		<slot />
	</div>
</template>
