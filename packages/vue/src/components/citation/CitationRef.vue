<script setup lang="ts">
import { computed } from 'vue';
import { useCitationContext } from './keys';
import type { CitationRenderProps } from './Citation.types';

defineOptions({ name: 'CitationRef' });

const props = defineProps<{
	for: string;
}>();

const ctx = useCitationContext();

const source = computed(() => ctx.getSource(props.for));
const index = computed(() => ctx.getIndex(props.for));
const label = computed(() => source.value?.label ?? String(index.value));
const footnoteId = computed(() => ctx.getFootnoteId(props.for));
const refId = computed(() => ctx.getRefId(props.for));

const slotProps = computed<CitationRenderProps>(() => ({
	source: source.value!,
	index: index.value,
}));
</script>

<template>
	<a
		v-if="source"
		:id="refId"
		:href="`#${footnoteId}`"
		role="doc-noteref"
		:aria-describedby="footnoteId"
		data-citation=""
		:data-index="index">
		<slot v-bind="slotProps">
			<sup>{{ label }}</sup>
		</slot>
	</a>
</template>
