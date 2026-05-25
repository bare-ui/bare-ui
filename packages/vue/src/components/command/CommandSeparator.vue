<script setup lang="ts">
import { computed } from 'vue';
import { useCommandContext } from './keys';

defineOptions({ name: 'CommandSeparator' });

const ctx = useCommandContext();
const searching = computed(() => ctx.searching);
</script>

<template>
	<div
		v-if="!searching"
		role="separator"
	/>
</template>
