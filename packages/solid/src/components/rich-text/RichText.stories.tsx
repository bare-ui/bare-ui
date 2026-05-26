import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
import { RichText } from './RichText';
import type { RichTextMode } from './RichText.types';
import type { MarkdownNode } from '../markdown/Markdown.types';

const meta = {
	title: 'AI/RichText',
	component: RichText.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A slot-based Markdown editor scaffold built on top of `Markdown`. Provides a toolbar with selection-wrapping actions, an editor textarea and a live preview, with edit / preview / split modes.',
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

export const Default: Story = {
	render: () => {
		const [mode, setMode] = createSignal<RichTextMode>('split');
		return (
			<RichText.Root
				defaultValue={'# Hello\n\nType **markdown** on the left, see it rendered on the right.\n\n- item one\n- item two'}
				mode={mode()}
				onModeChange={setMode}
				parse={miniParse}
				components={{
					heading: (props) => <h3 class='mb-2 text-lg font-bold text-black'>{props.children}</h3>,
					paragraph: (props) => <p class='mb-2 text-sm text-[#374151]'>{props.children}</p>,
					list: (props) => <ul class='mb-2 list-disc pl-5 text-sm text-[#374151]'>{props.children}</ul>,
					strong: (props) => <strong class='font-semibold text-black'>{props.children}</strong>,
				}}
				class='w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5e7eb]'>
				<RichText.Toolbar class='flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5'>
					<RichText.Action
						wrap='**'
						class={`${actionCls} font-bold`}>
						B
					</RichText.Action>
					<RichText.Action
						wrap='_'
						class={`${actionCls} italic`}>
						I
					</RichText.Action>
					<RichText.Action
						wrap={['[', '](url)']}
						class={actionCls}>
						Link
					</RichText.Action>
					<RichText.Action
						insert={'\n- '}
						class={actionCls}>
						• List
					</RichText.Action>
					<div class='ml-auto flex gap-1'>
						<For each={['edit', 'split', 'preview'] as const}>
							{(m) => (
								<button
									type='button'
									onClick={() => setMode(m)}
									class={tabCls(mode() === m)}>
									{m}
								</button>
							)}
						</For>
					</div>
				</RichText.Toolbar>

				<div class={`grid ${mode() === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
					<RichText.Editor
						class='min-h-48 w-full resize-none border-r border-[#e5e7eb] p-3 font-mono text-sm outline-none'
						placeholder='Write some markdown…'
					/>
					<RichText.Preview class='min-h-48 p-3' />
				</div>
			</RichText.Root>
		);
	},
};
