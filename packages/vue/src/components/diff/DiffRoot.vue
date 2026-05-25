<script setup lang="ts">
import { provide, computed } from 'vue';
import { DiffKey } from './keys';
import { diffLines, buildRows } from './diff-algorithm';

defineOptions({ name: 'DiffRoot' });

const props = defineProps<{
	oldValue: string;
	newValue: string;
}>();

const lines = computed(() => diffLines(props.oldValue, props.newValue));
const rows = computed(() => buildRows(lines.value));
const stats = computed(() => ({
	additions: lines.value.filter((l) => l.type === 'insert').length,
	deletions: lines.value.filter((l) => l.type === 'delete').length,
}));

provide(DiffKey, {
	get lines() { return lines.value; },
	get rows() { return rows.value; },
	get stats() { return stats.value; },
});
</script>

<template>
	<div>
		<slot />
	</div>
</template>
