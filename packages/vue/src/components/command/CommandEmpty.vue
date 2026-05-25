<script setup lang="ts">
import { computed } from 'vue';
import { useCommandContext } from './keys';

defineOptions({ name: 'CommandEmpty' });

const ctx = useCommandContext();
const hasVisible = computed(() => ctx.visible.length > 0);
</script>

<template>
	<div
		v-if="!hasVisible"
		role="presentation"
	>
		<slot />
	</div>
</template>
