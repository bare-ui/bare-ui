<script setup lang="ts">
import { useInfiniteScrollContext } from './keys';

defineOptions({ name: 'InfiniteScrollEndMessage' })

const ctx = useInfiniteScrollContext();
</script>

<template>
	<div v-if="!ctx.hasMore">
		<slot />
	</div>
</template>
