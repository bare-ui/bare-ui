import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { RichText } from '.';
import type { RichTextMode } from './RichText.types';
import type { MarkdownNode } from '../markdown/Markdown.types';

const meta = {
	title: 'AI/RichText',
	component: RichText.Root,
	subcomponents: {
		'RichText.Toolbar': RichText.Toolbar,
		'RichText.Action': RichText.Action,
		'RichText.Editor': RichText.Editor,
		'RichText.Preview': RichText.Preview,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A slot-based Markdown editor scaffold. Provides a toolbar with selection-wrapping actions, an editor textarea and a live preview, with edit / preview / split modes.',
			},
		},
	},
} satisfies Meta<typeof RichText.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// A tiny demo parser (swap for remark/marked in real apps).
function miniParse(src: string): MarkdownNode[] {
	return src.split('\n\n').map((block) => {
		const heading = block.match(/^(#{1,3})\s+(.*)$/);
		if (heading) return { type: 'heading', depth: heading[1].length, children: inline(heading[2]) };
		if (block.startsWith('- ')) {
			return {
				type: 'list',
				ordered: false,
				children: block
					.split('\n')
					.map((li) => ({ type: 'listItem', children: inline(li.replace(/^- /, '')) })),
			};
		}
		return { type: 'paragraph', children: inline(block) };
	});
}

function inline(text: string): MarkdownNode[] {
	const nodes: MarkdownNode[] = [];
	const regex = /\*\*(.+?)\*\*/g;
	let last = 0;
	let m: RegExpExecArray | null;
	while ((m = regex.exec(text))) {
		if (m.index > last) nodes.push({ type: 'text', value: text.slice(last, m.index) });
		nodes.push({ type: 'strong', children: [{ type: 'text', value: m[1] }] });
		last = m.index + m[0].length;
	}
	if (last < text.length) nodes.push({ type: 'text', value: text.slice(last) });
	return nodes;
}

const actionCls = 'rounded-md px-2 py-1 text-sm text-[#374151] hover:bg-[#f3f4f6]';
const tabCls = (active: boolean) =>
	`rounded-md px-2 py-1 text-sm ${active ? 'bg-black text-white' : 'text-[#6b7280] hover:bg-[#f3f4f6]'}`;

const previewComponents = {
	heading: { props: ['node'], template: `<h3 class="mb-2 text-lg font-bold text-black"><slot /></h3>` },
	paragraph: { props: ['node'], template: `<p class="mb-2 text-sm text-[#374151]"><slot /></p>` },
	list: { props: ['node'], template: `<ul class="mb-2 list-disc pl-5 text-sm text-[#374151]"><slot /></ul>` },
	strong: { props: ['node'], template: `<strong class="font-semibold text-black"><slot /></strong>` },
};

export const Default: Story = {
	render: () => ({
		setup() {
			const mode = ref<RichTextMode>('split');

			return () =>
				h(
					RichText.Root,
					{
						defaultValue: '# Hello\n\nType **markdown** on the left, see it rendered on the right.\n\n- item one\n- item two',
						mode: mode.value,
						onModeChange: (m: RichTextMode) => { mode.value = m; },
						parse: miniParse,
						components: previewComponents,
						class: 'w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5e7eb]',
					},
					() => [
						h(
							RichText.Toolbar,
							{ class: 'flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5' },
							() => [
								h(RichText.Action, { wrap: '**', class: `${actionCls} font-bold` }, () => 'B'),
								h(RichText.Action, { wrap: '_', class: `${actionCls} italic` }, () => 'I'),
								h(RichText.Action, { wrap: ['[', '](url)'], class: actionCls }, () => 'Link'),
								h(RichText.Action, { insert: '\n- ', class: actionCls }, () => '• List'),
								h(
									'div',
									{ class: 'ml-auto flex gap-1' },
									(['edit', 'split', 'preview'] as const).map((m) =>
										h(
											'button',
											{
												key: m,
												type: 'button',
												onClick: () => { mode.value = m; },
												class: tabCls(mode.value === m),
											},
											m,
										),
									),
								),
							],
						),
						h(
							'div',
							{ class: `grid ${mode.value === 'split' ? 'grid-cols-2' : 'grid-cols-1'}` },
							[
								h(RichText.Editor, {
									class: 'min-h-48 w-full resize-none border-r border-[#e5e7eb] p-3 font-mono text-sm outline-none',
									placeholder: 'Write some markdown…',
								}),
								h(RichText.Preview, { class: 'min-h-48 p-3' }),
							],
						),
					],
				);
		},
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex w-full max-w-2xl flex-col gap-6' }, [
				// Edit-only: a focused authoring surface
				h('div', null, [
					h('p', { class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' }, 'Edit mode'),
					h(
						RichText.Root,
						{
							defaultMode: 'edit',
							defaultValue: 'Write **markdown** here — the preview is hidden in edit mode.',
							parse: miniParse,
							components: previewComponents,
							class: 'overflow-hidden rounded-xl border border-[#e5e7eb]',
						},
						() => [
							h(
								RichText.Toolbar,
								{ class: 'flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5' },
								() => [
									h(RichText.Action, { wrap: '**', class: `${actionCls} font-bold` }, () => 'B'),
									h(RichText.Action, { wrap: '_', class: `${actionCls} italic` }, () => 'I'),
								],
							),
							h(RichText.Editor, {
								class: 'min-h-32 w-full resize-none p-3 font-mono text-sm outline-none',
								placeholder: 'Write some markdown…',
							}),
							h(RichText.Preview, { class: 'min-h-32 p-3' }),
						],
					),
				]),

				// Preview-only: render stored markdown read-only
				h('div', null, [
					h('p', { class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' }, 'Preview mode'),
					h(
						RichText.Root,
						{
							defaultMode: 'preview',
							defaultValue:
								'# Release notes\n\nShipped **RichText** with edit, split and preview modes.\n\n- toolbar actions\n- live preview',
							parse: miniParse,
							components: previewComponents,
							class: 'overflow-hidden rounded-xl border border-[#e5e7eb]',
						},
						() => [
							h(RichText.Editor, { class: 'min-h-32 w-full resize-none p-3 font-mono text-sm outline-none' }),
							h(RichText.Preview, { class: 'min-h-32 p-3' }),
						],
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const value = ref('Looks great! Just one **nit** on the naming.');
			const mode = ref<RichTextMode>('edit');

			return () =>
				h('div', { class: 'w-full max-w-lg rounded-xl border border-[#e5e7eb] bg-white' }, [
					h(
						RichText.Root,
						{
							value: value.value,
							onChange: (v: string) => { value.value = v; },
							mode: mode.value,
							onModeChange: (m: RichTextMode) => { mode.value = m; },
							parse: miniParse,
							components: previewComponents,
						},
						() => [
							h(
								RichText.Toolbar,
								{ class: 'flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5' },
								() => [
									h(RichText.Action, { wrap: '**', class: `${actionCls} font-bold` }, () => 'B'),
									h(RichText.Action, { wrap: '_', class: `${actionCls} italic` }, () => 'I'),
									h(RichText.Action, { wrap: ['`', '`'], class: `${actionCls} font-mono` }, () => '</>'),
									h(
										'div',
										{ class: 'ml-auto flex gap-1' },
										(['edit', 'preview'] as const).map((m) =>
											h(
												'button',
												{
													key: m,
													type: 'button',
													onClick: () => { mode.value = m; },
													class: tabCls(mode.value === m),
												},
												m === 'edit' ? 'Write' : 'Preview',
											),
										),
									),
								],
							),
							h(RichText.Editor, {
								rows: 4,
								class: 'min-h-28 w-full resize-none p-3 text-sm outline-none',
								placeholder: 'Leave a comment…',
							}),
							h(RichText.Preview, { class: 'min-h-28 p-3' }),
						],
					),
					h('div', { class: 'flex items-center justify-between border-t border-[#e5e7eb] px-3 py-2' }, [
						h('span', { class: 'text-xs text-[#9ca3af]' }, `${value.value.length} characters`),
						h(
							'button',
							{
								type: 'button',
								disabled: value.value.trim().length === 0,
								class: 'rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40',
							},
							'Comment',
						),
					]),
				]);
		},
	}),
};
