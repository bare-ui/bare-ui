import { h, type VNode } from 'vue';
import type { MarkdownComponents, MarkdownNode } from './Markdown.types';

// ---------------------------------------------------------------------------
// Default renderers — semantic HTML, zero styling
// ---------------------------------------------------------------------------

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export const defaultComponents: MarkdownComponents = {
	root: (_props, { slots }) => slots.default?.(),
	paragraph: (_props, { slots }) => h('p', slots.default?.()),
	heading: (props, { slots }) => {
		const level = Math.min(Math.max((props.node.depth ?? 1), 1), 6);
		const tag = headingTags[level - 1];
		return h(tag, slots.default?.());
	},
	text: (props) => h('span', { style: 'display:contents' }, props.node.value),
	strong: (_props, { slots }) => h('strong', slots.default?.()),
	emphasis: (_props, { slots }) => h('em', slots.default?.()),
	delete: (_props, { slots }) => h('del', slots.default?.()),
	inlineCode: (props) => h('code', { 'data-inline': '' }, props.node.value),
	code: (props) =>
		h('pre', { 'data-language': props.node.lang || undefined }, [
			h('code', { 'data-language': props.node.lang || undefined }, props.node.value),
		]),
	link: (props, { slots }) =>
		h(
			'a',
			{
				href: props.node.url,
				title: props.node.title ?? undefined,
			},
			slots.default?.(),
		),
	image: (props) =>
		h('img', {
			src: props.node.url,
			alt: props.node.alt ?? '',
			title: props.node.title ?? undefined,
		}),
	list: (props, { slots }) =>
		props.node.ordered ?
			h('ol', { start: props.node.start }, slots.default?.())
		:	h('ul', slots.default?.()),
	listItem: (props, { slots }) => {
		const isTask = props.node.checked === true || props.node.checked === false;
		return h(
			'li',
			{
				'data-checked': props.node.checked === true ? '' : undefined,
				'data-task': isTask ? '' : undefined,
			},
			[
				isTask ?
					h('input', {
						type: 'checkbox',
						checked: props.node.checked === true,
						disabled: true,
					})
				:	null,
				...(slots.default?.() ?? []),
			],
		);
	},
	blockquote: (_props, { slots }) => h('blockquote', slots.default?.()),
	thematicBreak: () => h('hr'),
	break: () => h('br'),
};

// ---------------------------------------------------------------------------
// Recursive rendering
// ---------------------------------------------------------------------------

export function renderNode(node: MarkdownNode, key: number | string, components: MarkdownComponents): VNode {
	const comp = components[node.type];

	const childVNodes =
		node.children && node.children.length > 0 ?
			node.children.map((child, i) => renderNode(child, i, components))
		:	undefined;

	if (comp) {
		// Render using the provided (or default) component.
		// Children are passed as the default slot so each renderer can call slots.default?.().
		return h(
			comp as Parameters<typeof h>[0],
			{ node, key },
			childVNodes ? { default: () => childVNodes } : undefined,
		);
	}

	// Fallback: unknown node type — render children or value.
	if (childVNodes) {
		return h('span', { key, style: 'display:contents' }, childVNodes);
	}
	// Leaf with a value — just a text node wrapped in a fragment-like span.
	return h('span', { key, style: 'display:contents' }, node.value ?? '');
}
