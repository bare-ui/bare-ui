import React, { useMemo } from 'react';
import type {
	MarkdownComponent,
	MarkdownComponents,
	MarkdownNode,
	MarkdownProps,
} from './Markdown.types';

// ---------------------------------------------------------------------------
// Default renderers — semantic HTML, zero styling
// ---------------------------------------------------------------------------

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const Fallback: MarkdownComponent = ({ node, children }) => <>{children ?? node.value ?? null}</>;

const defaultComponents: MarkdownComponents = {
	root: ({ children }) => <>{children}</>,
	paragraph: ({ children }) => <p>{children}</p>,
	heading: ({ node, children }) => {
		const level = Math.min(Math.max(node.depth ?? 1, 1), 6);
		const Tag = headingTags[level - 1];
		return <Tag>{children}</Tag>;
	},
	text: ({ node }) => <>{node.value}</>,
	strong: ({ children }) => <strong>{children}</strong>,
	emphasis: ({ children }) => <em>{children}</em>,
	delete: ({ children }) => <del>{children}</del>,
	inlineCode: ({ node }) => <code data-inline=''>{node.value}</code>,
	code: ({ node }) => (
		<pre data-language={node.lang || undefined}>
			<code data-language={node.lang || undefined}>{node.value}</code>
		</pre>
	),
	link: ({ node, children }) => (
		<a
			href={node.url}
			title={node.title ?? undefined}>
			{children}
		</a>
	),
	image: ({ node }) => (
		<img
			src={node.url}
			alt={node.alt ?? ''}
			title={node.title ?? undefined}
		/>
	),
	list: ({ node, children }) =>
		node.ordered ?
			<ol start={node.start}>{children}</ol>
		:	<ul>{children}</ul>,
	listItem: ({ node, children }) => {
		const isTask = node.checked === true || node.checked === false;
		return (
			<li
				data-checked={node.checked === true ? '' : undefined}
				data-task={isTask ? '' : undefined}>
				{isTask && (
					<input
						type='checkbox'
						checked={node.checked === true}
						disabled
						readOnly
					/>
				)}
				{children}
			</li>
		);
	},
	blockquote: ({ children }) => <blockquote>{children}</blockquote>,
	thematicBreak: () => <hr />,
	break: () => <br />,
};

// ---------------------------------------------------------------------------
// Recursive rendering
// ---------------------------------------------------------------------------

function renderNode(node: MarkdownNode, key: React.Key, components: MarkdownComponents): React.ReactNode {
	const Comp = components[node.type] ?? Fallback;
	const children =
		node.children && node.children.length > 0 ?
			node.children.map((child, i) => renderNode(child, i, components))
		:	undefined;
	return React.createElement(Comp, { node, key }, children);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
	({ nodes, content, parse, components, className, ...rest }, ref) => {
		const resolvedNodes = useMemo<MarkdownNode[]>(() => {
			if (nodes) return nodes;
			if (content === undefined) return [];
			if (parse) return parse(content);
			// Graceful fallback: render the raw string as a single paragraph.
			return [{ type: 'paragraph', children: [{ type: 'text', value: content }] }];
		}, [nodes, content, parse]);

		const merged = useMemo<MarkdownComponents>(
			() => ({ ...defaultComponents, ...components }),
			[components],
		);

		return (
			<div
				ref={ref}
				className={className}
				{...rest}>
				{resolvedNodes.map((node, i) => renderNode(node, i, merged))}
			</div>
		);
	},
);

Markdown.displayName = 'Markdown';

export { Markdown };
