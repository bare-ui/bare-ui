<script setup lang="ts">
import { provide, computed } from 'vue';
import { useId } from '@/composables/use-id';
import { CitationKey } from './keys';
import type { CitationRootProps, CitationSource } from './Citation.types';

defineOptions({ name: 'CitationRoot' });

const props = defineProps<{
	sources: CitationRootProps['sources'];
}>();

const baseId = useId('citation');

function getSource(id: string): CitationSource | undefined {
	return props.sources.find((s) => s.id === id);
}

const indexMap = computed(() => {
	const map = new Map<string, number>();
	props.sources.forEach((s, i) => map.set(s.id, i + 1));
	return map;
});

function getIndex(id: string): number {
	return indexMap.value.get(id) ?? 0;
}

function getRefId(id: string): string {
	return `${baseId}-ref-${id}`;
}

function getFootnoteId(id: string): string {
	return `${baseId}-note-${id}`;
}

provide(CitationKey, {
	get sources() { return props.sources; },
	getSource,
	getIndex,
	getRefId,
	getFootnoteId,
});
</script>

<template>
	<div>
		<slot />
	</div>
</template>
