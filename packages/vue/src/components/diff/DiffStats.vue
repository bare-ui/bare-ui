<script setup lang="ts">
import { useDiffContext } from './keys';

defineOptions({ name: 'DiffStats' });

const ctx = useDiffContext();
</script>

<template>
	<slot
		:additions="ctx.stats.additions"
		:deletions="ctx.stats.deletions" />
</template>
