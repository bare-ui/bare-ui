<script setup lang="ts">
import { useAttrs, computed } from 'vue';
import { useRichTextContext } from './keys';
import { renderMarkdown, resolveNodes } from './markdown-renderer';

defineOptions({ name: 'RichTextPreview', inheritAttrs: false })

const attrs = useAttrs();
const ctx = useRichTextContext();

const nodes = computed(() => resolveNodes(undefined, ctx.value, ctx.parse));
const mergedComponents = computed(() => ctx.components ?? {});
</script>

<template>
	<div
		v-if="ctx.mode !== 'edit'"
		v-bind="attrs"
		:data-mode="ctx.mode">
		<component
			:is="() => renderMarkdown(nodes, mergedComponents)"
		/>
	</div>
</template>
