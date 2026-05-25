import { h, type VNode } from 'vue';
import type { MarkdownComponent, MarkdownComponents, MarkdownNode } from '../markdown/Markdown.types';

// ---------------------------------------------------------------------------
// Default renderers — semantic HTML, zero styling
// ---------------------------------------------------------------------------

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

function renderChildren(node: MarkdownNode, components: MarkdownComponents): VNode[] | string | undefined {
	if (node.children && node.children.length > 0) {
		return node.children.map((child, i) => renderNode(child, components, i));
	}
	return undefined;
}

function renderNode(node: MarkdownNode, components: MarkdownComponents, key: number | string): VNode {
	const children = renderChildren(node, components);

	const custom = components[node.type];
	if (custom) {
		// Pass children as the default slot so custom templates can use <slot />.
		return h(custom as MarkdownComponent, { node, key }, children !== undefined ? { default: () => children } : undefined);
	}

	switch (node.type) {
		case 'root':
			return h('div', { key }, children);
		case 'paragraph':
			return h('p', { key }, children);
		case 'heading': {
			const level = Math.min(Math.max(node.depth ?? 1, 1), 6);
			const tag = headingTags[level - 1];
			return h(tag, { key }, children);
		}
		case 'text':
			return h('span', { key, 'data-text': '' }, node.value ?? '');
		case 'strong':
			return h('strong', { key }, children);
		case 'emphasis':
			return h('em', { key }, children);
		case 'delete':
			return h('del', { key }, children);
		case 'inlineCode':
			return h('code', { key, 'data-inline': '' }, node.value ?? '');
		case 'code':
			return h('pre', { key, 'data-language': node.lang || undefined }, [
				h('code', { 'data-language': node.lang || undefined }, node.value ?? ''),
			]);
		case 'link':
			return h('a', { key, href: node.url, title: node.title ?? undefined }, children);
		case 'image':
			return h('img', { key, src: node.url, alt: node.alt ?? '', title: node.title ?? undefined });
		case 'list':
			return node.ordered ?
				h('ol', { key, start: node.start }, children)
			:	h('ul', { key }, children);
		case 'listItem': {
			const isTask = node.checked === true || node.checked === false;
			const inner: VNode[] = [];
			if (isTask) {
				inner.push(h('input', { type: 'checkbox', checked: node.checked === true, disabled: true }));
			}
			if (Array.isArray(children)) {
				inner.push(...children);
			} else if (children !== undefined) {
				inner.push(children as unknown as VNode);
			}
			return h(
				'li',
				{ key, 'data-checked': node.checked === true ? '' : undefined, 'data-task': isTask ? '' : undefined },
				inner,
			);
		}
		case 'blockquote':
			return h('blockquote', { key }, children);
		case 'thematicBreak':
			return h('hr', { key });
		case 'break':
			return h('br', { key });
		default:
			// Fallback: render children or value
			if (children) return h('span', { key }, children);
			return h('span', { key }, node.value ?? '');
	}
}

export function renderMarkdown(
	nodes: MarkdownNode[],
	components: MarkdownComponents = {},
): VNode[] {
	return nodes.map((node, i) => renderNode(node, components, i));
}

export function resolveNodes(
	nodes: MarkdownNode[] | undefined,
	content: string | undefined,
	parse: ((content: string) => MarkdownNode[]) | undefined,
): MarkdownNode[] {
	if (nodes) return nodes;
	if (content === undefined) return [];
	if (parse) return parse(content);
	// Graceful fallback: render the raw string as a single paragraph.
	return [{ type: 'paragraph', children: [{ type: 'text', value: content }] }];
}
