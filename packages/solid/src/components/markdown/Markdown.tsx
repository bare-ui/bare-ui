import { createMemo, splitProps, For, Show, type JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
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

const Fallback: MarkdownComponent = (props) => <>{props.children ?? props.node.value ?? null}</>;

const defaultComponents: MarkdownComponents = {
	root: (props) => <>{props.children}</>,
	paragraph: (props) => <p>{props.children}</p>,
	heading: (props) => {
		const level = () => Math.min(Math.max(props.node.depth ?? 1, 1), 6);
		return <Dynamic component={headingTags[level() - 1]}>{props.children}</Dynamic>;
	},
	text: (props) => <>{props.node.value}</>,
	strong: (props) => <strong>{props.children}</strong>,
	emphasis: (props) => <em>{props.children}</em>,
	delete: (props) => <del>{props.children}</del>,
	inlineCode: (props) => <code data-inline=''>{props.node.value}</code>,
	code: (props) => (
		<pre data-language={props.node.lang || undefined}>
			<code data-language={props.node.lang || undefined}>{props.node.value}</code>
		</pre>
	),
	link: (props) => (
		<a
			href={props.node.url}
			title={props.node.title ?? undefined}>
			{props.children}
		</a>
	),
	image: (props) => (
		<img
			src={props.node.url}
			alt={props.node.alt ?? ''}
			title={props.node.title ?? undefined}
		/>
	),
	list: (props) => (
		<Show
			when={props.node.ordered}
			fallback={<ul>{props.children}</ul>}>
			<ol start={props.node.start}>{props.children}</ol>
		</Show>
	),
	listItem: (props) => {
		const isTask = () => props.node.checked === true || props.node.checked === false;
		return (
			<li
				data-checked={props.node.checked === true ? '' : undefined}
				data-task={isTask() ? '' : undefined}>
				{isTask() && (
					<input
						type='checkbox'
						checked={props.node.checked === true}
						disabled
						readOnly
					/>
				)}
				{props.children}
			</li>
		);
	},
	blockquote: (props) => <blockquote>{props.children}</blockquote>,
	thematicBreak: () => <hr />,
	break: () => <br />,
};

// ---------------------------------------------------------------------------
// Recursive rendering
// ---------------------------------------------------------------------------

function renderNode(node: MarkdownNode, components: MarkdownComponents): JSX.Element {
	const Comp = components[node.type] ?? Fallback;
	const children =
		node.children && node.children.length > 0 ?
			<For each={node.children}>{(child) => renderNode(child, components)}</For>
		:	undefined;
	return (
		<Dynamic
			component={Comp}
			node={node}>
			{children}
		</Dynamic>
	);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Markdown(props: MarkdownProps) {
	const [local, rest] = splitProps(props, ['nodes', 'content', 'parse', 'components', 'class']);

	const resolvedNodes = createMemo<MarkdownNode[]>(() => {
		if (local.nodes) return local.nodes;
		if (local.content === undefined) return [];
		if (local.parse) return local.parse(local.content);
		// Graceful fallback: render the raw string as a single paragraph.
		return [{ type: 'paragraph', children: [{ type: 'text', value: local.content }] }];
	});

	const merged = createMemo<MarkdownComponents>(() => ({
		...defaultComponents,
		...local.components,
	}));

	return (
		<div
			class={local.class}
			{...rest}>
			<For each={resolvedNodes()}>{(node) => renderNode(node, merged())}</For>
		</div>
	);
}

export { Markdown };
