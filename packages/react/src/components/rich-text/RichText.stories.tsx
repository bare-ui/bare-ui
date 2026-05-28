import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichText } from './RichText';
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

const previewComponents = {
	heading: ({ children }: { children?: ReactNode }) => (
		<h3 className='mb-2 text-lg font-bold text-black'>{children}</h3>
	),
	paragraph: ({ children }: { children?: ReactNode }) => <p className='mb-2 text-sm text-[#374151]'>{children}</p>,
	list: ({ children }: { children?: ReactNode }) => (
		<ul className='mb-2 list-disc pl-5 text-sm text-[#374151]'>{children}</ul>
	),
	strong: ({ children }: { children?: ReactNode }) => (
		<strong className='font-semibold text-black'>{children}</strong>
	),
};

export const Default: Story = {
	render: () => {
		const [mode, setMode] = useState<RichTextMode>('split');
		return (
			<RichText.Root
				defaultValue={
					'# Hello\n\nType **markdown** on the left, see it rendered on the right.\n\n- item one\n- item two'
				}
				mode={mode}
				onModeChange={setMode}
				parse={miniParse}
				components={previewComponents}
				className='w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5e7eb]'>
				<RichText.Toolbar className='flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5'>
					<RichText.Action
						wrap='**'
						className={`${actionCls} font-bold`}>
						B
					</RichText.Action>
					<RichText.Action
						wrap='_'
						className={`${actionCls} italic`}>
						I
					</RichText.Action>
					<RichText.Action
						wrap={['[', '](url)']}
						className={actionCls}>
						Link
					</RichText.Action>
					<RichText.Action
						insert={'\n- '}
						className={actionCls}>
						• List
					</RichText.Action>
					<div className='ml-auto flex gap-1'>
						{(['edit', 'split', 'preview'] as const).map((m) => (
							<button
								key={m}
								type='button'
								onClick={() => setMode(m)}
								className={tabCls(mode === m)}>
								{m}
							</button>
						))}
					</div>
				</RichText.Toolbar>

				<div className={`grid ${mode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
					<RichText.Editor
						className='min-h-48 w-full resize-none border-r border-[#e5e7eb] p-3 font-mono text-sm outline-none'
						placeholder='Write some markdown…'
					/>
					<RichText.Preview className='min-h-48 p-3' />
				</div>
			</RichText.Root>
		);
	},
};

export const Composed: Story = {
	render: () => (
		<div className='flex w-full max-w-2xl flex-col gap-6'>
			{/* Edit-only: a focused authoring surface */}
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Edit mode</p>
				<RichText.Root
					defaultMode='edit'
					defaultValue={'Write **markdown** here — the preview is hidden in edit mode.'}
					parse={miniParse}
					components={previewComponents}
					className='overflow-hidden rounded-xl border border-[#e5e7eb]'>
					<RichText.Toolbar className='flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5'>
						<RichText.Action
							wrap='**'
							className={`${actionCls} font-bold`}>
							B
						</RichText.Action>
						<RichText.Action
							wrap='_'
							className={`${actionCls} italic`}>
							I
						</RichText.Action>
					</RichText.Toolbar>
					<RichText.Editor
						className='min-h-32 w-full resize-none p-3 font-mono text-sm outline-none'
						placeholder='Write some markdown…'
					/>
					<RichText.Preview className='min-h-32 p-3' />
				</RichText.Root>
			</div>

			{/* Preview-only: render stored markdown read-only */}
			<div>
				<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Preview mode</p>
				<RichText.Root
					defaultMode='preview'
					defaultValue={
						'# Release notes\n\nShipped **RichText** with edit, split and preview modes.\n\n- toolbar actions\n- live preview'
					}
					parse={miniParse}
					components={previewComponents}
					className='overflow-hidden rounded-xl border border-[#e5e7eb]'>
					<RichText.Editor className='min-h-32 w-full resize-none p-3 font-mono text-sm outline-none' />
					<RichText.Preview className='min-h-32 p-3' />
				</RichText.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const [value, setValue] = useState('Looks great! Just one **nit** on the naming.');
		const [mode, setMode] = useState<RichTextMode>('edit');

		return (
			<div className='w-full max-w-lg rounded-xl border border-[#e5e7eb] bg-white'>
				<RichText.Root
					value={value}
					onChange={setValue}
					mode={mode}
					onModeChange={setMode}
					parse={miniParse}
					components={previewComponents}>
					<RichText.Toolbar className='flex items-center gap-1 border-b border-[#e5e7eb] bg-[#fafafa] p-1.5'>
						<RichText.Action
							wrap='**'
							className={`${actionCls} font-bold`}>
							B
						</RichText.Action>
						<RichText.Action
							wrap='_'
							className={`${actionCls} italic`}>
							I
						</RichText.Action>
						<RichText.Action
							wrap={['`', '`']}
							className={`${actionCls} font-mono`}>
							{'</>'}
						</RichText.Action>
						<div className='ml-auto flex gap-1'>
							{(['edit', 'preview'] as const).map((m) => (
								<button
									key={m}
									type='button'
									onClick={() => setMode(m)}
									className={tabCls(mode === m)}>
									{m === 'edit' ? 'Write' : 'Preview'}
								</button>
							))}
						</div>
					</RichText.Toolbar>

					<RichText.Editor
						rows={4}
						className='min-h-28 w-full resize-none p-3 text-sm outline-none'
						placeholder='Leave a comment…'
					/>
					<RichText.Preview className='min-h-28 p-3' />
				</RichText.Root>

				<div className='flex items-center justify-between border-t border-[#e5e7eb] px-3 py-2'>
					<span className='text-xs text-[#9ca3af]'>{value.length} characters</span>
					<button
						type='button'
						disabled={value.trim().length === 0}
						className='rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40'>
						Comment
					</button>
				</div>
			</div>
		);
	},
};
