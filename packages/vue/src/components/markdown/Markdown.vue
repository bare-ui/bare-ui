<script lang="ts">
import { defineComponent, computed, h } from 'vue';
import { defaultComponents, renderNode } from './markdown-render';
import type { MarkdownComponents, MarkdownNode } from './Markdown.types';

export default defineComponent({
	name: 'Markdown',
	props: {
		nodes: {
			type: Array as () => MarkdownNode[],
			default: undefined,
		},
		content: {
			type: String,
			default: undefined,
		},
		parse: {
			type: Function as unknown as () => (content: string) => MarkdownNode[],
			default: undefined,
		},
		components: {
			type: Object as () => MarkdownComponents,
			default: undefined,
		},
	},
	setup(props) {
		const resolvedNodes = computed<MarkdownNode[]>(() => {
			if (props.nodes) return props.nodes;
			if (props.content === undefined) return [];
			if (props.parse) return (props.parse as (content: string) => MarkdownNode[])(props.content);
			// Graceful fallback: render the raw string as a single paragraph.
			return [{ type: 'paragraph', children: [{ type: 'text', value: props.content }] }];
		});

		const merged = computed<MarkdownComponents>(() => ({
			...defaultComponents,
			...props.components,
		}));

		return () =>
			h(
				'div',
				resolvedNodes.value.map((node, i) => renderNode(node, i, merged.value)),
			);
	},
});
</script>
